import { useNavigate } from "react-router-dom";
import "./styles.css";

import logo from "../../assets/Logo.png";   
import capa from "../../assets/capa.jpg";   

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // aqui poderia validar login...
    navigate("/home"); // redireciona pra Home
  }

  return (
    <div className="page">
      <div
        className="media"
        style={{ backgroundImage: `url(${capa})` }} 
        role="img"
        aria-label="Imagem de capa"
      />

      <main className="panel">
        <header className="brand">
          <img src={logo} alt="Logo" className="logo" />
        </header>

        <div className="welcome">
          <p className="muted">Bem vindo(a)!</p>
          <h1>Entre na sua conta</h1>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="beforeInput">E-mail</span>
            <input 
              type="email"
              placeholder="Digite aqui seu e-mail"
              required
            />
          </label>

          <label className="field">
            <span className="beforeInput">Senha</span>
            <input
              type="password"
              placeholder="Digite aqui sua senha"
              required
              minLength={8}
            />
          </label>

          <button type="submit" className="btn primary">Entrar</button>
          <button 
            type="button" 
            className="btn ghost"
            onClick={() => navigate("/home")}  /* exemplo: cadastre-se tb leva pra home */
          >
            Cadastre-se
          </button>
        </form>
      </main>
    </div>
  );
}
