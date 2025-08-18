import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./styles.module.css";
import Header from "../../components/Header";

type Livro = {
  id: string | number;
  titulo: string;
  autor: string;
  genero: string;
  preco: number;
  sinopse: string;
  capa: string;
};

function normalizaGenero(txt: string) {

  return (txt || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, ""); 
}

export default function GeneroPage() {
  const { nome } = useParams();
  const generoAlvo = useMemo(
    () => normalizaGenero(decodeURIComponent(nome || "")),
    [nome]
  );

  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        setLoading(true);
        setErro("");

        const resp = await fetch("http://localhost:3001/livros");
        if (!resp.ok) throw new Error("Não foi possível carregar os livros.");
        const data: Livro[] = await resp.json();
        if (cancelado) return;

        const filtrados = (data || []).filter((l) => {
          return normalizaGenero(l.genero) === generoAlvo;
        });

        setLivros(filtrados.slice(0, 8));
      } catch (e) {
        if (!cancelado)
          setErro(e instanceof Error ? e.message : "Erro ao carregar os livros.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [generoAlvo]);

  const formatarPreco = (preco: number) => {
    try {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(preco));
    } catch {
      return `R$ ${preco}`;
    }
  };

  const tituloPagina = useMemo(() => {
   
    const semAcento = (nome || "")
      .toLowerCase()
      .replace(/\b\w/g, (m) => m.toUpperCase());
    return decodeURIComponent(semAcento || "Gênero");
  }, [nome]);

  return (
   <>
    
   <Header/>
    <main className={styles.genero}>
      <div className={styles.genero__top}>
        <Link to="/home" className={styles.back}>← Voltar</Link>
        <h2 className={styles.genero__titulo}>{tituloPagina}</h2>
      </div>

      {loading && (
        <section className={`${styles.grid} ${styles.skeleton}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div className={`${styles.card} ${styles.sk}`} key={i}>
              <div className={styles["sk-cover"]} />
              <div className={styles["sk-lines"]}>
                <div className={`${styles["sk-line"]} ${styles.lg}`} />
                <div className={`${styles["sk-line"]} ${styles.md}`} />
                <div className={`${styles["sk-line"]} ${styles.sm}`} />
              </div>
            </div>
          ))}
        </section>
      )}

      {!loading && erro && (
        <section className={styles.erro}>
          <p>{erro}</p>
          <Link className={styles.btn} to="/home">Voltar para a Home</Link>
        </section>
      )}

      {!loading && !erro && livros.length === 0 && (
        <section className={styles.vazio}>
          <p>Nenhum livro encontrado para “{tituloPagina}”.</p>
        </section>
      )}

      {!loading && !erro && livros.length > 0 && (
        <section className={styles.grid}>
          {livros.map((l) => (
            <Link to={`/detalhes/${l.id}`} className={styles.card} key={l.id}>
              <div className={styles.card__cover}>
                <img
                  src={l.capa || "https://placehold.co/280x380?text=Sem+Capa"}
                  alt={l.titulo}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://placehold.co/280x380?text=Sem+Capa";
                  }}
                />
              </div>
              <div className={styles.card__body}>
                <h3 className={styles.card__title}>{l.titulo}</h3>
                <p className={styles.card__author}>{l.autor}</p>
                <div className={styles.card__price}>{formatarPreco(l.preco)}</div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
      </>
  );
}
