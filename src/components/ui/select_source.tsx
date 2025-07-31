type Props = {
  downloadPDF: (i: number, type_file_download: string) => void;
};

export default function SelectSource({ downloadPDF }: Props) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <label
        htmlFor="file-download-select"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Download Document
      </label>
      <select
        id="file-download-select"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-800 bg-white"
        defaultValue="-1"
        onChange={(e) => {
          const selectedValue = parseInt(e.target.value);
          if (selectedValue !== -1) {
            const type_file_download = selectedValue === 0 ? 'CV' : 'cover_letter';
            downloadPDF(selectedValue, type_file_download);
          }
        }}
      >
        <option value="-1" disabled>Select Source to Download</option>
        <option value="0">Download CV</option>
        <option value="1">Download Cover Letter</option>
      </select>
    </div>
  );
}
