'use client';

import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";

const CartTable = ({ cart }: { cart?: Cart }) => {
    const router = useRouter();
    const [ isPending, startTransition ] = useTransition()
  return (
    <div>
        <h1 className="py-4 h2-bold">
            Shopping Cart
        </h1>
        { !cart || cart.items.length === 0 ? (
            <div>Cart is empty. <Link href="/">Go Shopping</Link></div>
        ) : (
            <div className="grid md:grid-cols-4 md:gap-5">
                <div className="overflow-x-auto md:col-span-3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>
            </div>
        ) }
    </div>
  )
}

export default CartTable