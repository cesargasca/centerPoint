"use client";
import {useSearchParams, usePathname} from "next/navigation";
import Link from "next/link";

interface ModalProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}
function Modal({ title,value,children, ...rest }: ModalProps) {
    const searchParams = useSearchParams();
    const modal = searchParams.get("modal");
    const pathname = usePathname();

    return (
        <>
                <dialog
                    className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                    <div className="bg-white m-auto p-8">
                        <div className="flex flex-col items-center">
                            <p>{title}</p>
                            <br/>
                            {children}
                        </div>
                    </div>
                </dialog>
        </>
    );
}

export default Modal;