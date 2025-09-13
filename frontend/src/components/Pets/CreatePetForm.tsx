import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
    CalendarIcon, 
    PhotoIcon, 
    VideoCameraIcon,
    PlusIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface CreatePetFormData {
    name: string;
    type: string;
    breed: string;
    color: string;
    birthDate: string;
    weight: number;
    gender: string;
    size: string;
    description: string;
    mainImageUrl: string;
    imageUrls: string[];
    videoUrls: string[];
    status: string;
    isNeutered: boolean;
    isVaccinated: boolean;
    healthNotes: string;
    behaviorNotes: string;
    specialNeeds: string;
    isMicrochipped: boolean;
    microchipNumber: string;
}

interface CreatePetFormProps {
    onSubmit: (data: CreatePetFormData) => void;
    isLoading?: boolean;
    initialData?: Partial<CreatePetFormData>;
}

const CreatePetForm: React.FC<CreatePetFormProps> = ({ 
    onSubmit, 
    isLoading = false,
    initialData 
}) => {
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || []);
    const [videoUrls, setVideoUrls] = useState<string[]>(initialData?.videoUrls || []);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newVideoUrl, setNewVideoUrl] = useState('');

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
        reset,
        setValue,
        watch
    } = useForm<CreatePetFormData>({
        defaultValues: {
            name: initialData?.name || '',
            type: initialData?.type || 'DOG',
            breed: initialData?.breed || '',
            color: initialData?.color || '',
            birthDate: initialData?.birthDate || '',
            weight: initialData?.weight || undefined,
            gender: initialData?.gender || 'MALE',
            size: initialData?.size || 'MEDIUM',
            description: initialData?.description || '',
            mainImageUrl: initialData?.mainImageUrl || '',
            status: initialData?.status || 'ACTIVE',
            isNeutered: initialData?.isNeutered || false,
            isVaccinated: initialData?.isVaccinated || false,
            healthNotes: initialData?.healthNotes || '',
            behaviorNotes: initialData?.behaviorNotes || '',
            specialNeeds: initialData?.specialNeeds || '',
            isMicrochipped: initialData?.isMicrochipped || false,
            microchipNumber: initialData?.microchipNumber || '',
        },
        mode: 'onChange'
    });

    const watchedType = watch('type');

    useEffect(() => {
        setValue('imageUrls', imageUrls);
        setValue('videoUrls', videoUrls);
    }, [imageUrls, videoUrls, setValue]);

    const addImageUrl = () => {
        if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
            setImageUrls([...imageUrls, newImageUrl.trim()]);
            setNewImageUrl('');
        }
    };

    const removeImageUrl = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    const addVideoUrl = () => {
        if (newVideoUrl.trim() && !videoUrls.includes(newVideoUrl.trim())) {
            setVideoUrls([...videoUrls, newVideoUrl.trim()]);
            setNewVideoUrl('');
        }
    };

    const removeVideoUrl = (index: number) => {
        setVideoUrls(videoUrls.filter((_, i) => i !== index));
    };

    const onFormSubmit = (data: CreatePetFormData) => {
        if (imageUrls.length === 0 && !data.mainImageUrl) {
            toast.error('En az bir resim eklemelisiniz');
            return;
        }
        onSubmit(data);
    };

    const petTypes = [
        { value: 'DOG', label: '🐕 Köpek' },
        { value: 'CAT', label: '🐱 Kedi' },
        { value: 'BIRD', label: '🐦 Kuş' },
        { value: 'FISH', label: '🐠 Balık' },
        { value: 'RABBIT', label: '🐰 Tavşan' },
        { value: 'HAMSTER', label: '🐹 Hamster' },
        { value: 'GUINEA_PIG', label: '🐹 Gine Domuzu' },
        { value: 'FERRET', label: '🦦 Gelincik' },
        { value: 'REPTILE', label: '🦎 Sürüngen' },
        { value: 'HORSE', label: '🐎 At' },
        { value: 'OTHER', label: '🐾 Diğer' }
    ];

    const petSizes = [
        { value: 'SMALL', label: 'Küçük' },
        { value: 'MEDIUM', label: 'Orta' },
        { value: 'LARGE', label: 'Büyük' }
    ];

    const petGenders = [
        { value: 'MALE', label: 'Erkek' },
        { value: 'FEMALE', label: 'Dişi' }
    ];

    const petStatuses = [
        { value: 'ACTIVE', label: 'Aktif' },
        { value: 'INACTIVE', label: 'Pasif' }
    ];

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🐾 Yeni Evcil Hayvan Ekle
            </h2>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {/* Temel Bilgiler */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        📋 Temel Bilgiler
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Evcil Hayvan Adı *
                            </label>
                            <input
                                type="text"
                                {...register('name', { required: 'İsim gereklidir' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Pamuk, Karabaş..."
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tür *
                            </label>
                            <select
                                {...register('type', { required: 'Tür seçilmelidir' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {petTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Irk
                            </label>
                            <input
                                type="text"
                                {...register('breed')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Tekir, Golden Retriever..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Renk
                            </label>
                            <input
                                type="text"
                                {...register('color')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Gri, Siyah, Beyaz..."
                            />
                        </div>
                    </div>
                </div>

                {/* Fiziksel Özellikler */}
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">
                        📏 Fiziksel Özellikler
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Doğum Tarihi
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    {...register('birthDate')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kilo (kg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                {...register('weight', { 
                                    min: { value: 0, message: 'Kilo negatif olamaz' }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="4.5"
                            />
                            {errors.weight && (
                                <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cinsiyet
                            </label>
                            <select
                                {...register('gender')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {petGenders.map(gender => (
                                    <option key={gender.value} value={gender.value}>
                                        {gender.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Boyut
                            </label>
                            <select
                                {...register('size')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {petSizes.map(size => (
                                    <option key={size.value} value={size.value}>
                                        {size.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Açıklama */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Açıklama
                    </label>
                    <textarea
                        {...register('description')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Evcil hayvanınız hakkında detaylı bilgi verin..."
                    />
                </div>

                {/* Medya */}
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">
                        📸 Medya
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ana Resim URL'si
                            </label>
                            <input
                                type="url"
                                {...register('mainImageUrl')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ek Resimler
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="url"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Resim URL'si ekleyin"
                                />
                                <button
                                    type="button"
                                    onClick={addImageUrl}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                </button>
                            </div>
                            {imageUrls.length > 0 && (
                                <div className="space-y-2">
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border">
                                            <PhotoIcon className="h-4 w-4 text-gray-400" />
                                            <span className="flex-1 text-sm text-gray-600 truncate">{url}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeImageUrl(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video URL'leri
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="url"
                                    value={newVideoUrl}
                                    onChange={(e) => setNewVideoUrl(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Video URL'si ekleyin"
                                />
                                <button
                                    type="button"
                                    onClick={addVideoUrl}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                </button>
                            </div>
                            {videoUrls.length > 0 && (
                                <div className="space-y-2">
                                    {videoUrls.map((url, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border">
                                            <VideoCameraIcon className="h-4 w-4 text-gray-400" />
                                            <span className="flex-1 text-sm text-gray-600 truncate">{url}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeVideoUrl(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sağlık ve Davranış */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                        🏥 Sağlık ve Davranış
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('isNeutered')}
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Kısırlaştırıldı</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('isVaccinated')}
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Aşılı</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('isMicrochipped')}
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Mikroçipli</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mikroçip Numarası
                            </label>
                            <input
                                type="text"
                                {...register('microchipNumber')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="123456789"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sağlık Notları
                            </label>
                            <textarea
                                {...register('healthNotes')}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Sağlık durumu..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Davranış Notları
                            </label>
                            <textarea
                                {...register('behaviorNotes')}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Karakter özellikleri..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Özel İhtiyaçlar
                            </label>
                            <textarea
                                {...register('specialNeeds')}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Özel bakım gereksinimleri..."
                            />
                        </div>
                    </div>
                </div>

                {/* Durum */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durum
                    </label>
                    <select
                        {...register('status')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {petStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Form Butonları */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Sıfırla
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid || isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Kaydediliyor...' : 'Evcil Hayvan Ekle'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePetForm;
