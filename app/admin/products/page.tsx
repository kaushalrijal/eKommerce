import Link from "next/link";
import { getAllProducts } from "@/lib/actions/product.actions";
import { formatCurrency, formatId } from "@/lib/utils";

const AdminProductsPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string;
    }>
}) => {

    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const searchText = searchParams.query || '';
    const category = searchParams.category || '';

    const products = await getAllProducts({
        query: searchText,
        page,
        category
    })

    console.log(products)
  return (
    <div className="sapce-y-2">
        <div className="flex-between">
            <div className="h2-bold">Products</div>
        </div>
    </div>
  )
}

export default AdminProductsPage