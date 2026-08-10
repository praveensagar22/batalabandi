import type { ProductCreateForm, ValidationResult, WizardStep } from './create-types';

function result(valid: boolean, errors: ValidationResult['errors'] = {}): ValidationResult {
  return { valid, errors };
}

export function validateStep(step: WizardStep, form: ProductCreateForm): ValidationResult {
  switch (step) {
    case 1:
      return validateBasicInfo(form);
    case 2:
      return validateClassification(form);
    case 3:
      return validateVariants(form);
    case 4:
      return validatePricing(form);
    case 5:
      return validateInventory(form);
    case 6:
      return validateImages(form);
    case 7:
      return validateSEO(form);
    case 8:
      return validateAll(form);
    default:
      return result(true);
  }
}

function validateBasicInfo(form: ProductCreateForm): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (!form.name.trim()) errors.name = 'Product name is required';
  if (!form.slug.trim()) errors.slug = 'Slug is required';
  if (!form.shortDescription.trim())
    errors.shortDescription = 'Short description is required';
  if (form.status === 'Scheduled' && !form.scheduledAt)
    errors.scheduledAt = 'Schedule date is required';
  return result(Object.keys(errors).length === 0, errors);
}

function validateClassification(form: ProductCreateForm): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (!form.gender) errors.gender = 'Gender is required';
  if (!form.category) errors.category = 'Category is required';
  if (!form.productType) errors.productType = 'Product type is required';
  if (!form.collection) errors.collection = 'Collection is required';
  if (!form.theme) errors.theme = 'Theme is required';
  return result(Object.keys(errors).length === 0, errors);
}

function validateVariants(form: ProductCreateForm): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (form.variants.length === 0)
    errors.variants = 'Generate at least one variant';
  return result(Object.keys(errors).length === 0, errors);
}

function validatePricing(form: ProductCreateForm): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (form.mrp <= 0) errors.mrp = 'MRP must be greater than 0';
  if (form.sellingPrice <= 0)
    errors.sellingPrice = 'Selling price must be greater than 0';
  if (form.sellingPrice > form.mrp)
    errors.sellingPrice = 'Selling price cannot exceed MRP';
  if (form.costPrice < 0) errors.costPrice = 'Cost price cannot be negative';
  return result(Object.keys(errors).length === 0, errors);
}

function validateInventory(form: ProductCreateForm): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (!form.masterSku.trim()) errors.masterSku = 'Master SKU is required';
  if (form.trackInventory && form.stockQuantity < 0)
    errors.stockQuantity = 'Stock cannot be negative';
  return result(Object.keys(errors).length === 0, errors);
}

function validateImages(form: ProductCreateForm): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (form.images.length === 0)
    errors.images = 'Upload at least one product image';
  return result(Object.keys(errors).length === 0, errors);
}

function validateSEO(form: ProductCreateForm): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (!form.metaTitle.trim()) errors.metaTitle = 'Meta title is required';
  if (!form.metaDescription.trim())
    errors.metaDescription = 'Meta description is required';
  return result(Object.keys(errors).length === 0, errors);
}

function validateAll(form: ProductCreateForm): ValidationResult {
  const steps: WizardStep[] = [1, 2, 3, 4, 5, 6, 7];
  const allErrors: ValidationResult['errors'] = {};

  for (const step of steps) {
    const { errors } = validateStep(step, form);
    Object.assign(allErrors, errors);
  }

  return result(Object.keys(allErrors).length === 0, allErrors);
}

export function getIncompleteSteps(form: ProductCreateForm): WizardStep[] {
  const steps: WizardStep[] = [1, 2, 3, 4, 5, 6, 7];
  return steps.filter((step) => !validateStep(step, form).valid);
}

export function canPublish(form: ProductCreateForm): boolean {
  return validateAll(form).valid;
}
