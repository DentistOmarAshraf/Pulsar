import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

function CategoryCard({ cateogry }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/category/${cateogry._id}`)}
      key={cateogry._id}
      className="card"
    >
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
