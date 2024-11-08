import "./Card.css";

function CategoryCard({ imgurl, name }) {
  return (
    <div className="card">
      <div className="card__image">
        <img src={imgurl} />
      </div>
      <div className="card__text">
        <h1>{name}</h1>
      </div>
    </div>
  );
}
export default CategoryCard;
