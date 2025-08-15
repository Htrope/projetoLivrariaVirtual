
import "./styles.css";


import logo from "../../assets/Logo.png";   
import capa from "../../assets/capa.jpg";   
export default function Login() {
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

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Login enviado");
          }}
        >
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
          <button type="button" className="btn ghost">Cadastre-se</button>
        </form>
      </main>
    </div>
  );
}
