import DynamicForm from "@/app/ui/DynamicForm";

interface CardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}
export default function Card({ title,value,children, ...rest }: CardProps){
    return (
        <div className=" max-w-xl rounded overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{title}</div>
                    <p className="text-gray-700 text-base">
                        {value}
                    </p>
                    {children}
                </div>
        </div>
    );
}