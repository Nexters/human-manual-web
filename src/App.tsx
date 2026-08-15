import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import Modal from "@/components/shared/Modal";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Modal />
    </>
  );
}

export default App;
