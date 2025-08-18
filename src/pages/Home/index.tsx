import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import "./styles.css";

import banner from "../../assets/baner.jpg";

const API_URL = "http://localhost:3001/livros";

export type Livro = {
  id: number | string;
  titulo: string;
  autor: string;
  genero?: string;
  preco?: number | string;
  capa?: string;
};

interface SectionProps {
  titulo: string;
  livros?: Livro[];
}

export default function Home() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregou = useRef(false);

  useEffect(() => {
    if (carregou.current) return;
    carregou.current = true;

    (async () => {
      setLoading(true);
      setErro("");

      try {
        const url = `${API_URL}?t=${Date.now()}`;
        const res = await fetch(url, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!res.ok) {
          throw new Error(`Falha ao carregar livros (HTTP ${res.status})`);
        }

        const data = await res.json();
        const arr = Array.isArray(data) ? data : data?.livros ?? [];

        const normalizados: Livro[] = arr.map((b: any) => ({
          id: b.id ?? b._id ?? crypto.randomUUID(),
          titulo: b.titulo ?? b.title ?? "",
          autor: b.autor ?? b.author ?? "",
          genero: b.genero ?? b.genre ?? "",
          preco: b.preco ?? b.price ?? 0,
          capa: b.capa ?? b.cover ?? "",
        }));

        setLivros(normalizados);
      } catch (e) {
        setErro(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const norm = (s?: string) =>
    (s ?? "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const bestSeller = useMemo(
    () => livros.filter((b) => norm(b.genero).includes("best")),
    [livros]
  );
  const classicos = useMemo(
    () => livros.filter((b) => norm(b.genero).includes("class")),
    [livros]
  );
  const infantil = useMemo(
    () => livros.filter((b) => norm(b.genero).includes("infantil")),
    [livros]
  );

  return (
    <>
      <Header />

      <main className="home">
        <div className="banner">
          <img src={banner} alt="Promoções da semana" />
          <div className="banner__text">
            <strong>25% de desconto</strong>
            <span>nos livros promocionais!</span>
          </div>
        </div>

        {loading && <div className="feedback">Carregando...</div>}
        {erro && !loading && <div className="feedback erro">Erro: {erro}</div>}

        {!loading && !erro && (
          <>
            <Section titulo="Best Seller" livros={bestSeller.slice(0, 4)} />
            <Section titulo="Clássicos" livros={classicos.slice(0, 4)} />
            <Section titulo="Infantil" livros={infantil.slice(0, 4)} />
          </>
        )}
      </main>
    </>
  );
}

/* ---------- helpers ---------- */
function slugifyGeneroLabel(label: string) {
  // remove acentos, vai pra minúsculas e troca espaços por hífen
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function formatarPreco(v?: number | string) {
  const num = Number(v);
  if (Number.isNaN(num)) return "R$ 0,00";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* ---------- componentes internos ---------- */
function Section({ titulo, livros = [] }: SectionProps) {
  if (!livros.length) return null;

  const generoPath = slugifyGeneroLabel(titulo); // ex.: "Clássicos" -> "classicos"

  return (
    <section className="section">
      <div className="section__head">
        <h2>{titulo}</h2>
        <Link className="see-more" to={`/genero/${generoPath}`}>
          Ver mais
        </Link>
      </div>

      <div className="grid">
        {livros.map((livro) => (
          <BookCard key={livro.id} livro={livro} />
        ))}
      </div>
    </section>
  );
}

function BookCard({ livro }: { livro: Livro }) {
  return (
    <Link to={`/detalhes/${livro.id}`} className="card">
      <div className="card__cover">
        <img
          src={livro.capa || "https://placehold.co/160x220?text=Livro"}
          alt={livro.titulo}
          loading="lazy"
        />
      </div>

      <div className="card__info">
        <p className="card__title">{livro.titulo}</p>
        <p className="card__author">{livro.autor}</p>
        <p className="card__price">{formatarPreco(livro.preco)}</p>
      </div>
    </Link>
  );
}
