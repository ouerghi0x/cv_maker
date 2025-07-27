
'use client';
type AddButtonProps = {
  text: string;
  style: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

function AddButton( props : AddButtonProps) {
  return (
    <button className= {`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${props.style}`} onClick={props.onClick}>
      {props.text}
    </button>
  );
}
export default AddButton;