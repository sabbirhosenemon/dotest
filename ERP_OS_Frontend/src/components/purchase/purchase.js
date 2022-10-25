import PageTitle from "../page-header/PageHeader";

import { Navigate } from "react-router-dom";
import AddPurch from "./addPurch";

const Purchase = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }
  return (
    <div>
      <PageTitle
        title="Purchase Dashboard"
        subtitle={"All Purchase Invoice List"}
      />

      <AddPurch />
    </div>
  );
};

export default Purchase;
