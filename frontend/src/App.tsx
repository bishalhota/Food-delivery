import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import {Toaster} from "react-hot-toast";
import ProtectedRoute from "./component/ProtecteRoute";
import PublicRoute from "./component/publicRoute";
import Navbar from "./component/navbar";
import Account from "./pages/Account";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route element = {<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/account" element={<Account />} />
        </Route>
        <Route element = {<PublicRoute />}>
          <Route path="/login" element={<Login />} />

        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App