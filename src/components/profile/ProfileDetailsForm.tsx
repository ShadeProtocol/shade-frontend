'use client';

import * as React from 'react';
import { useState } from 'react';
import { ProfileDetailsFormData } from '@/types/profile';
import { Button } from '@/components/ui/button';

export interface ProfileDetailsFormProps {
  initialData: ProfileDetailsFormData;
  onSubmit: (data: ProfileDetailsFormData) => Promise<void> | void;
}

export function ProfileDetailsForm({
  initialData,
  onSubmit,
}: ProfileDetailsFormProps) {
  const [formData, setFormData] = useState<ProfileDetailsFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="businessName"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900"
          >
            Business Name
          </label>
          <input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="category"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900"
          >
            Category
          </label>
          <input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="flex w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
