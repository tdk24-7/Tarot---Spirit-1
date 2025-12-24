import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary with your Cloud Name
// TODO: Replace 'your-cloud-name' with your actual Cloudinary Cloud Name
const cld = new Cloudinary({
  cloud: {
    cloudName: 'dfp2ne3nn', 
  },
});

export default cld; 