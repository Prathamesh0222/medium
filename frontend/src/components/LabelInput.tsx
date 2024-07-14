import { ChangeEventHandler } from "react";


interface LabelInputProps {
    label : string;
    placeholder: string;
    onChange: ChangeEventHandler<HTMLInputElement>,
    type?: string
}

export const LabelInput = ({label,placeholder,onChange,type}:LabelInputProps) =>{
    return  <div className="pb-4">
    <label className="block mb-2 text-sm text-gray-900 font-semibold pt-2">{label}</label>
    <input onChange={onChange} type={type} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
</div>
}