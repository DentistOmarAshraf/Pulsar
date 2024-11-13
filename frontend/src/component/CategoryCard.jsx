import "./CategoryCard.css";

function CategoryCard({ cateogry }) {
  return (
    <div key={cateogry.id} className="card">
      <div className="card__image">
        <img src={`http://localhost:5001/photo/${cateogry.photo}`} />
      </div>
      <div className="card__text">
        <h1>{cateogry.name}</h1>
      </div>
    </div>
  );
}
export default CategoryCard;
