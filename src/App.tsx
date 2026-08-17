import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import Modal from "@/components/shared/Modal";
import Toast from "@/components/shared/Toast";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Modal />
      <Toast />
    </>
  );
}

export default App;
