import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./styles.css";
import Header from "../../components/Header";
type Livro = {
  id?: number | string;
  cover?: string;
  capa?: string;
  title?: string;
  titulo?: string;
  author?: string;
  autor?: string;
  description?: string;
  descricao?: string;
  resumo?: string;
  detalhes?: { sinopse?: string };
  details?: { synopsis?: string };
  price?: number | string;
  preco?: number | string;
  [key: string]: any;
};

export default function VerMais() {
  const { id } = useParams<{ id: string }>();

  const [livro, setLivro] = useState<Livro | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) {
      setErro("ID não informado na rota.");
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErro("");

        const resp = await fetch(`http://localhost:3001/livros/${id}`, {
          signal: ctrl.signal,
        });
        if (!resp.ok) throw new Error("Livro não encontrado.");

        const data: Livro = await resp.json();
        setLivro(data);
      } catch (e: unknown) {
        if ((e as any)?.name === "AbortError") return;
        const msg = e instanceof Error ? e.message : "Erro ao carregar o livro.";
        setErro(msg);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [id]);

  
  const titulo = useMemo(
    () => (livro?.title ?? livro?.titulo ?? "Sem título"),
    [livro]
  );
  const autor = useMemo(
    () => (livro?.author ?? livro?.autor ?? "Autor desconhecido"),
    [livro]
  );
  const capa = useMemo(() => (livro?.cover ?? livro?.capa ?? ""), [livro]);

  const sinopse = useMemo(() => {
    return (
      livro?.sinopse ??
      livro?.descricao ??
      livro?.description ??
      livro?.resumo ??
      livro?.detalhes?.sinopse ??
      livro?.details?.synopsis ??
      ""
    );
  }, [livro]);

  const precoFmt = useMemo(() => {
    const valor = livro?.price ?? livro?.preco ?? 0;
    try {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(Number(valor));
    } catch {
      return `R$ ${valor}`;
    }
  }, [livro]);

  return (
    <>
      <Header/>
      <main className="detalhes">
        <div className="detalhes__top">
          <Link to="/home" className="voltar">
            ← Detalhes do livro
          </Link>
        </div>

        {loading && (
          <section className="skeleton">
            <div className="sk-img" />
            <div className="sk-text">
              <div className="sk-line lg" />
              <div className="sk-line md" />
              <div className="sk-line" />
              <div className="sk-line" />
              <div className="sk-line" />
            </div>
          </section>
        )}

        {!loading && erro && (
          <section className="erro">
            <p>{erro}</p>
            <Link className="btn simples" to="/home">
              Voltar para a lista
            </Link>
          </section>
        )}

        {!loading && !erro && livro && (
          <section className="painel">
           
            <div className="painel__capa">
              <img
                src={capa}
                alt={titulo}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/260x360?text=Sem+Capa";
                }}
              />
            </div>

           
            <div className="painel__conteudo">
              <h1 className="titulo">{titulo}</h1>
              <p className="autor">{autor}</p>

              <div className="bloco">
                <h2 className="sub">Sinopse</h2>
                <p className="texto">
                  {sinopse || "Sem sinopse disponível."}
                </p>
              </div>

              <div className="acao">
                <span className="preco">{precoFmt}</span>
                <button
                  className="btn primario"
                  onClick={() => alert("Adicionado ao carrinho!")}
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
