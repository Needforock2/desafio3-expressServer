import {
  Button,
  Card,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState} from "react";
import swal from "sweetalert";
import { CartContext } from "../../store/context";
import { useNavigate, useParams } from "react-router-dom";

axios.defaults.withCredentials = true;

function NewProduct() {
  const params = useParams();
  const [productEdit, setProductEdit] = useState({});
  const { pid } = params;
  const { role } = useContext(CartContext);
  const navigate = useNavigate();
    const [productData, setProductData] = useState({
      title: "",
      description: "",
      price: "",
      thumbnails: "",
      code: "",
      stock: "",
      category: "",
    });


  useEffect(() => {
    if (role === 0) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
        async function fetchProd() {
          const url = `${import.meta.env.VITE_BACKEND_URL}/products/${pid}`;
          try {
            const resp = await axios.get(url);
            setProductEdit(resp.data);
            setProductData(resp.data);
          } catch (error) {
            swal({
              title: "Ooops 404",
              text: "Not found",
              icon: "error",
            });
            navigate("/");
          }
        }
          if (pid) {
            fetchProd();
          }
  },[])


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const url = `${import.meta.env.VITE_BACKEND_URL}/products`;
    try {
      const resp = await axios.post(url, productData, config);
      if (resp.data.status === "success") {
        swal({
          title: "Éxito",
          text: "Producto Creado",
          icon: "success",
        });
      }
      setProductData({
        title: "",
        description: "",
        price: "",
        thumbnail: "",
        code: "",
        stock: "",
        category: "",
      });
    } catch (error) {
      swal({
        title: "Error",
        text: "No tienes permiso",
        icon: "warning",
      });
    }
  };

  const handleSave = async (event) => {
     event.preventDefault();
     const config = {
       headers: {
         "content-type": "application/json",
       },
     };
     const url = `${import.meta.env.VITE_BACKEND_URL}/products/${pid}`;
     try {
       const resp = await axios.put(url, productData, config);
       if (resp.data.success === true) {
         swal({
           title: "Éxito",
           text: "Producto Editado Exitosamente",
           icon: "success",
         });
       }
       setProductData({
         title: "",
         description: "",
         price: "",
         thumbnail: "",
         code: "",
         stock: "",
         category: "",
       });
     } catch (error) {
       swal({
         title: "Error",
         text: "No tienes permiso",
         icon: "warning",
       });
     }
  }

  return (
    <>
      {role === 0 ? null : (
        <Card maxW="50vw" m="20px auto" p={10}>
          <Heading>{!pid ? "Crear Producto" : "Editar Producto"}</Heading>
          <form onSubmit={handleCreate}>
            <FormLabel>
              Título:
              <Input
                required
                type="text"
                name="title"
                placeholder={pid ? productEdit.title : productData.title}
                value={productData.title}
                onChange={handleInputChange}
              />
            </FormLabel>
            <br />
            <FormLabel>
              Descripción:
              <Textarea
                required
                name="description"
                placeholder={
                  pid ? productEdit.description : productData.description
                }
                value={productData.description}
                onChange={handleInputChange}
              />
            </FormLabel>
            <br />
            <FormLabel>
              Precio:
              <Input
                required
                type="number"
                name="price"
                placeholder={pid ? productEdit.price : productData.price}
                value={productData.price}
                onChange={handleInputChange}
              />
            </FormLabel>
            <br />
            <FormLabel>
              URL de la Foto:
              <Input
                required
                type="text"
                name="thumbnails"
                placeholder={
                  pid ? productEdit.thumbnails : productData.thumbnails
                }
                value={productData.thumbnails}
                onChange={handleInputChange}
              />
            </FormLabel>
            <br />
            <FormLabel>
              Código:
              <Input
                required
                type="number"
                name="code"
                placeholder={pid ? productEdit.code : productData.code}
                value={productData.code}
                onChange={handleInputChange}
              />
            </FormLabel>
            <br />
            <FormLabel>
              Stock:
              <Input
                required
                type="number"
                name="stock"
                placeholder={pid ? productEdit.stock : productData.stock}
                value={productData.stock}
                onChange={handleInputChange}
              />
            </FormLabel>
            <br />
            <FormLabel>
              Categoria:
              <Input
                required
                type="text"
                name="category"
                placeholder={pid ? productEdit.category : productData.category}
                value={productData.category}
                onChange={handleInputChange}
              />
            </FormLabel>
            <br />
            <>
              {pid ? (
                <Button onClick={handleSave}>Guardar Cambios</Button>
              ) : (
                <Button onClick={handleCreate}>Crear Producto</Button>
              )}
            </>
          </form>
        </Card>
      )}
    </>
  );
}

export default NewProduct;
