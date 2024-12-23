const ImageUploadPreview = ({ images, handleFileChange, handleDeleteImage }) => {

    return (
        <div>
            <label className="block mb-2 font-medium">Images</label>
            <input
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
            />

            {images.length > 0 && (
                <div className="mt-4">
                    <div className="flex flex-wrap gap-4">
                        {images.map((image) => (
                            <div key={image.id} className="relative flex items-center gap-2 border border-gray-400 p-1 rounded-md">
                                <img
                                    src={image.image || image.preview}
                                    alt={image.image ? image.image.split("/").pop() : image.file.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <span>{image.image ? image.image.split("/").pop() : image.file.name}</span>
                                <button
                                    onClick={() => handleDeleteImage(image)}
                                    className="absolute top-0 right-0 text-white bg-red-500 rounded-full px-1"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploadPreview;
