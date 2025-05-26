type PageHeaderProps = {
   title: string;
   description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
   return (
      <div className="mb-6">
         <h1 className="text-xl font-bold mb-2">{title}</h1>
         {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
   );
}