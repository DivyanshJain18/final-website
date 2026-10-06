import { useParams, Navigate } from 'react-router-dom';
import ProductDetails from './ProductDetails';

/**
 * Handles descriptive SEO friendly product URLs such as:
 * /3d-printers/bambu-lab-a1-mini-combo-3d-printer
 * /robotic-components/arduino-uno-r3-atmega328p
 * /computer-components/rtx-3060-12gb
 * /category/:categorySlug/:slug
 * 
 * Renders ProductDetails component using the product slug.
 */
export default function CategoryProductRouter() {
  const { slug } = useParams();

  if (!slug) {
    return <Navigate to="/shop" replace />;
  }

  return <ProductDetails />;
}
