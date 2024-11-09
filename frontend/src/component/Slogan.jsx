import "./Slogan.css";

function Slogan({ text }) {
  return (
    <div className="slogan__container">
      <div className="slogan__text_container">
        <h1>{text}</h1>
      </div>
    </div>
  );
}

export default Slogan;
