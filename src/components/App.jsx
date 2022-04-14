import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from "./Searchbar";
import ImageGallery from "./ImageGallery";
import ImageGalleryItem from "./ImageGalleryItem";
import Button from "./Button";
import Loading from "utils/loading";
import Modal from "./Modal";
import findImages from "services/services";


export default function App () {

  const [searchValue, setSearchValue] = useState('');
  const [arrayOfImages, setArrayOfImages] = useState([]);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalTag, setModalTag] = useState(null);

  useEffect(() => {
    if (!searchValue) {
      return;
    }
    fetch();
  }, [searchValue, page]);

  const fetch = async() => {
    try {
      Loading.circle();
      let pictures = await findImages(searchValue, page);

      if (pictures.totalHits === 0) {
        setVisible(false);
        toast.info('No pictures found for your request');
        Loading.remove();
        return;
      }
      
      if (page === 1) {
        setArrayOfImages ([...pictures.hits]);
      }
      
      if (arrayOfImages.length === pictures.totalHits) {
        setVisible (false);
      }

      if (page > 1) {
          setArrayOfImages(prev=> [...prev, ...pictures.hits]);
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }

    } catch (error) {
      toast.error('Something wrong');
      Loading.remove();
      return Promise.reject(error);
    }
    Loading.remove();
  }

  const getImageforModal = (image, tag) => {
    toggleModal();
    setModalImage(image);
    setModalTag(tag);
  }

  const handleClickLoadMore = () => {
    setPage (prev => prev + 1);
  };

  const handleFormSubmit = value => {
    setSearchValue(value);
    setPage(1);
    setArrayOfImages([]);
    setVisible(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };


    return (
      <>
        <ToastContainer />
        <Searchbar formSubmit={handleFormSubmit} />
        <ImageGallery>
          <ImageGalleryItem
            images={arrayOfImages}
            onGetImage={getImageforModal}
          />
        </ImageGallery>
        {visible && <Button onHandleClickLoadMore={handleClickLoadMore} />}
        {showModal && (
          <Modal onClose={toggleModal}>
            <img src={modalImage} alt={modalTag} />
          </Modal>
        )}
      </>
    );
  }