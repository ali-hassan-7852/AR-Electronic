import productData from '@/data/products.json';import categoryData from '@/data/categories.json';import business from '@/data/business.json';import type {Product,Category,Filters} from './types';
export const categories:Category[]=categoryData;
export const getProducts=():Product[]=>productData;
export const getProductBySlug=(slug:string)=>getProducts().find(p=>p.slug===slug);
export const getFeaturedProducts=()=>getProducts().filter(p=>p.featured);
export const getProductsByCategory=(id:string)=>getProducts().filter(p=>p.categoryId===id);
export const getProductsByBrand=(brand:string)=>getProducts().filter(p=>p.brand===brand);
export const getRelatedProducts=(p:Product)=>getProducts().filter(x=>x.id!==p.id&&(x.categoryId===p.categoryId||x.brand===p.brand)).slice(0,4);
export const brands=Array.from(new Set(getProducts().map(p=>p.brand))).sort();
export const formatPrice=(p:Pick<Product,'price'|'showPrice'|'priceLabel'>)=>!p.showPrice||!p.price||p.price<=0?'Contact for Latest Price':p.priceLabel||new Intl.NumberFormat('en-PK',{style:'currency',currency:business.currency,maximumFractionDigits:0}).format(p.price).replace('PKR','Rs.');
export const stockStatus=(p:Product)=>p.outOfStock?'Out of stock':p.onOrder?'On order':p.lowStock?'Low stock':p.inStock?'In stock':'Check availability';
export const purchaseLabel=(p:Product)=>p.outOfStock||p.onOrder||!p.inStock?'Ask About Availability':'Buy on WhatsApp';
export const emptyFilters:Filters={q:'',category:'',brand:'',availability:'',featured:false,newArrival:false,min:'',max:'',sort:'featured'};
export function searchProducts(query:string){const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);return getProducts().filter(p=>{const hay=[p.name,p.brand,p.model,p.shortDescription,categories.find(c=>c.id===p.categoryId)?.name,...p.specifications.map(s=>s.label+' '+s.value)].join(' ').toLowerCase();return terms.every(t=>hay.includes(t));});}
export function filterProducts(f:Filters){const minimum=f.min===''?null:Number(f.min),maximum=f.max===''?null:Number(f.max);const result=searchProducts(f.q).filter(p=>(!f.category||p.categoryId===f.category)&&(!f.brand||p.brand===f.brand)&&(!f.availability||(f.availability==='inStock'?p.inStock&&!p.outOfStock&&!p.onOrder:f.availability==='lowStock'?p.lowStock:f.availability==='outOfStock'?p.outOfStock:p.onOrder))&&(!f.featured||p.featured)&&(!f.newArrival||p.newArrival)&&(minimum===null||(p.showPrice&&p.price!==null&&p.price>=minimum))&&(maximum===null||(p.showPrice&&p.price!==null&&p.price<=maximum)));
return result.sort((a,b)=>f.sort==='price-asc'?(a.showPrice&&a.price?a.price:Infinity)-(b.showPrice&&b.price?b.price:Infinity):f.sort==='price-desc'?(b.showPrice&&b.price?b.price:-Infinity)-(a.showPrice&&a.price?a.price:-Infinity):f.sort==='name'?a.name.localeCompare(b.name):f.sort==='newest'?b.addedAt.localeCompare(a.addedAt):Number(b.featured)-Number(a.featured));}
