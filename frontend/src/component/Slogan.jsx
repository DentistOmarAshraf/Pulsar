import "./Slogan.css";

function Slogan({ text }) {
  return (
    <div className="container">
      <div className="slogan__container">
        <h1>{text}</h1>
      </div>
    </div>
  );
}

export default Slogan;
