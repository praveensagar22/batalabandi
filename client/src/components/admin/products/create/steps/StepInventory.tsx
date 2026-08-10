'use client';

import type { ProductCreateForm, StepErrors } from '@/lib/products/create-types';
import {
  WAREHOUSE_OPTIONS,
  SHIPPING_CLASS_OPTIONS,
} from '@/lib/products/create-defaults';
import TextInput from '../ui/TextInput';
import NumberInput from '../ui/NumberInput';
import SelectInput from '../ui/SelectInput';
import ToggleGroup from '../ui/ToggleGroup';
import InventoryCard from '../cards/InventoryCard';

interface StepProps {
  form: ProductCreateForm;
  onChange: (updates: Partial<ProductCreateForm>) => void;
  errors: StepErrors;
}

export default function StepInventory({ form, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Inventory</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Manage stock levels, warehouse, and shipping details.
        </p>
      </div>

      <InventoryCard form={form} />

      <div className="bg-white border border-stone-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextInput
            label="Master SKU"
            id="masterSku"
            value={form.masterSku}
            onChange={(masterSku) => onChange({ masterSku })}
            placeholder="HD-NAR-1001"
            required
            error={errors.masterSku}
          />
          <NumberInput
            label="Stock Quantity"
            id="stockQuantity"
            value={form.stockQuantity}
            onChange={(stockQuantity) => onChange({ stockQuantity })}
            error={errors.stockQuantity}
            disabled={!form.trackInventory}
          />
          <NumberInput
            label="Low Stock Threshold"
            id="lowStockThreshold"
            value={form.lowStockThreshold}
            onChange={(lowStockThreshold) => onChange({ lowStockThreshold })}
            hint="Alert when stock falls below this level"
          />
          <SelectInput
            label="Warehouse"
            id="warehouse"
            value={form.warehouse}
            onChange={(warehouse) => onChange({ warehouse })}
            options={WAREHOUSE_OPTIONS}
          />
          <SelectInput
            label="Shipping Class"
            id="shippingClass"
            value={form.shippingClass}
            onChange={(shippingClass) => onChange({ shippingClass })}
            options={SHIPPING_CLASS_OPTIONS}
          />
          <NumberInput
            label="Weight"
            id="weight"
            value={form.weight}
            onChange={(weight) => onChange({ weight })}
            suffix="g"
          />
        </div>

        <div className="grid grid-cols-3 gap-5">
          <NumberInput
            label="Length"
            id="length"
            value={form.length}
            onChange={(length) => onChange({ length })}
            suffix="cm"
          />
          <NumberInput
            label="Width"
            id="width"
            value={form.width}
            onChange={(width) => onChange({ width })}
            suffix="cm"
          />
          <NumberInput
            label="Height"
            id="height"
            value={form.height}
            onChange={(height) => onChange({ height })}
            suffix="cm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          <ToggleGroup
            label="Track Inventory"
            value={form.trackInventory}
            onChange={(trackInventory) => onChange({ trackInventory })}
          />
          <ToggleGroup
            label="Allow Backorders"
            value={form.allowBackorders}
            onChange={(allowBackorders) => onChange({ allowBackorders })}
            hint="Allow orders when out of stock"
          />
        </div>
      </div>
    </div>
  );
}
