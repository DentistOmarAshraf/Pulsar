import Slogan from "../component/Slogan";
import Header from "../component/Header";
import AddMerchant from "../component/AddMerchant";

function AddNewMerchant() {
  return (
    <>
      <Header />
      <Slogan text={"Pulsar: Where Every Click Sparks Joy"} />
      <AddMerchant />
    </>
  );
}

export default AddNewMerchant;
