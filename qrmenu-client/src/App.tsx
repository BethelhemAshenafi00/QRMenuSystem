import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import FoodDetails from "./pages/FoodDetails";
import Home from "./pages/Home";
import OrderProgressPage from "./pages/OrderProgress";
import OrderSuccess from "./pages/OrderSuccess";

import {
  getTableIdFromSearchParams,
  getTableNumberFromSearchParams,
  saveTableId,
  saveTableNumber,
} from "./utils/tableSession";

function TableSessionHandler() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tableId = getTableIdFromSearchParams(searchParams);
    const tableNumber = getTableNumberFromSearchParams(searchParams);

    if (tableId) {
      saveTableId(tableId);
    }

    if (tableNumber) {
      saveTableNumber(tableNumber);
    }
  }, [searchParams]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <TableSessionHandler />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders/:id/progress" element={<OrderProgressPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
