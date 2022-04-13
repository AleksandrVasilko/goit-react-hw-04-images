import axios from 'axios';

const API_KEY = '24801124-06fccb0e586a8b9d373fb9ce7';

async function findImages(searchValue, page) {
    const response = await axios.get(
        `https://pixabay.com/api/?q=${searchValue}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`,
    );
    const pictures = await response.data;
    return pictures;
}

export default findImages;