import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateCar, useUpdateCar } from '@/hooks/useAdmin';
import { useCar } from '@/hooks/useCar'; // Changed from useCar
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  Loader2,
  X,
  Upload,
  Plus,
  Car as CarEmoji,
} from 'lucide-react';
import { type CarFormData } from '@/types/carTypes';

export const CarUploadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: existingCar, isLoading: isLoadingCar } = useCar(id || '', {
    enabled: isEditMode,
  });

  const createCar = useCreateCar();
  const updateCar = useUpdateCar();

  const [formData, setFormData] = useState<CarFormData>({
    name: '',
    year: new Date().getFullYear(),
    fuel: '',
    seats: 5,
    price: 0,
    status: 'available',
    type: 'Sedan',
    amenities: [''],
    images: [],
    transmission: 'Auto',
    duration: '12 hours',
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing car data in edit mode
  useEffect(() => {
    if (existingCar && isEditMode) {
      setFormData({
        name: existingCar.name,
        year: existingCar.features.year,
        fuel: existingCar.features.fuel,
        seats: existingCar.features.seats,
        price: existingCar.price,
        status: existingCar.available ? 'available' : 'unavailable',
        type: existingCar.type,
        amenities: [''], // Backend should provide this
        images: existingCar.images,
        transmission: existingCar.features.transmission || 'Auto',
        duration: existingCar.features.duration,
      });
      setImagePreviews(existingCar.images);
    }
  }, [existingCar, isEditMode]);

  const handleInputChange = (field: keyof CarFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAmenityChange = (index: number, value: string) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData((prev) => ({ ...prev, amenities: newAmenities }));
  };

  const addAmenity = () => {
    setFormData((prev) => ({
      ...prev,
      amenities: [...prev.amenities, ''],
    }));
  };

  const removeAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Get current image count (handle both File[] and string[])
    const currentImages = formData.images || [];
    const currentImagesCount = currentImages.length;

    if (currentImagesCount + files.length > 3) {
      setErrors((prev) => ({
        ...prev,
        images: 'Maximum 3 images allowed',
      }));
      return;
    }

    // Create previews for new files only
    const newPreviews: string[] = [];
    let loadedCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        loadedCount++;

        // Once all files are loaded, update state
        if (loadedCount === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Add new files to existing images
    setFormData((prev) => ({
      ...prev,
      images: [...currentImages, ...files],
    }));

    // Clear any previous image errors
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (index: number) => {
    // Update formData.images
    setFormData((prev) => {
      const currentImages = prev.images || [];
      return {
        ...prev,
        images: currentImages.filter((_, i) => i !== index),
      };
    });

    // Update imagePreviews
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Car name is required';
    if (formData.year < 2000 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Invalid year';
    }
    if (!formData.fuel.trim()) newErrors.fuel = 'Fuel type is required';
    if (formData.seats < 1 || formData.seats > 20) {
      newErrors.seats = 'Invalid number of seats';
    }
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';

    // Check if images exist (only for create mode)
    if (!isEditMode) {
      const hasImages = formData.images && formData.images.length > 0;
      if (!hasImages) {
        newErrors.images = 'At least one image is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(isEditMode, id);
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditMode && id) {
        await updateCar.mutateAsync({ id, ...formData });
      } else {
        await createCar.mutateAsync(formData);
      }
      navigate('/admin/cars');
    } catch (error) {
      console.error('Failed to save car:', error);
    }
  };

  if (isLoadingCar) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          {isEditMode ? 'Edit Car' : 'Add a New Car'}{' '}
          <CarEmoji className="w-8 h-8" />
        </h1>
        <p className="text-slate-600 mt-2">
          {isEditMode
            ? 'Update car details'
            : 'Fill in the details to add a new vehicle to your fleet'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={errors.name ? 'text-red-500' : ''}
              >
                Name
              </Label>
              <Input
                id="name"
                placeholder="Car Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-xs text-red-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label
                htmlFor="year"
                className={errors.year ? 'text-red-500' : ''}
              >
                Year
              </Label>
              <Input
                id="year"
                type="number"
                placeholder="2025"
                value={formData.year}
                onChange={(e) =>
                  handleInputChange('year', parseInt(e.target.value) || 2025)
                }
                className={errors.year ? 'border-red-500' : ''}
              />
              {errors.year && (
                <p className="text-xs text-red-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.year}
                </p>
              )}
            </div>

            {/* Fuel */}
            <div className="space-y-2">
              <Label
                htmlFor="fuel"
                className={errors.fuel ? 'text-red-500' : ''}
              >
                Fuel
              </Label>
              <Input
                id="fuel"
                placeholder="Petrol, Diesel, Electric, Hybrid"
                value={formData.fuel}
                onChange={(e) => handleInputChange('fuel', e.target.value)}
                className={errors.fuel ? 'border-red-500' : ''}
              />
              {errors.fuel && (
                <p className="text-xs text-red-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.fuel}
                </p>
              )}
            </div>

            {/* Seats */}
            <div className="space-y-2">
              <Label
                htmlFor="seats"
                className={errors.seats ? 'text-red-500' : ''}
              >
                Seats
              </Label>
              <Select
                value={formData.seats.toString()}
                onValueChange={(val) =>
                  handleInputChange('seats', parseInt(val))
                }
              >
                <SelectTrigger
                  id="seats"
                  className={errors.seats ? 'border-red-500' : ''}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.seats && (
                <p className="text-xs text-red-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.seats}
                </p>
              )}
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <Label htmlFor="duration">Hours</Label>
              <Input
                id="duration"
                type="text"
                placeholder="12"
                value={formData.duration?.replace(' hours', '') || '12'}
                onChange={(e) =>
                  handleInputChange('duration', `${e.target.value} hours`)
                }
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className={errors.price ? 'text-red-500' : ''}
              >
                Price per day (₦)
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="12000"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange('price', parseInt(e.target.value) || 0)
                }
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-xs text-red-500 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.price}
                </p>
              )}
            </div>

            {/* Car Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Car Status</Label>
              <Select
                value={formData.status}
                onValueChange={(
                  val: 'available' | 'unavailable' | 'maintenance'
                ) => handleInputChange('status', val)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Car Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Car Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val: 'SUV' | 'Sedan' | 'Van') =>
                  handleInputChange('type', val)
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Amenities</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAmenity}
              className="border-slate-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Amenity
            </Button>
          </div>

          <div className="space-y-3">
            {formData.amenities.map((amenity, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Amenity ${index + 1}`}
                  value={amenity}
                  onChange={(e) => handleAmenityChange(index, e.target.value)}
                  className="flex-1"
                />
                {formData.amenities.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAmenity(index)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Car Images */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Car Images (Max 3)
          </h2>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {imagePreviews.length < 3 && (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Click to upload images ({imagePreviews.length}/3)
                </span>
                <span className="text-xs text-slate-500">
                  PNG, JPG up to 5MB
                </span>
              </label>
            </div>
          )}

          {errors.images && (
            <p className="text-xs text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.images}
            </p>
          )}
        </div>

        {/* Error Message */}
        {(createCar.isError || updateCar.isError) && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {'Failed to save car'}
            </p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/cars')}
            className="flex-1 h-12 border-slate-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createCar.isPending || updateCar.isPending}
            className="flex-1 h-12 bg-slate-900 text-white hover:bg-slate-800"
          >
            {createCar.isPending || updateCar.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditMode ? (
              'Update Car'
            ) : (
              'Create Car'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
