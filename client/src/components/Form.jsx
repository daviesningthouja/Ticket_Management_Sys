// ReusableForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
//import { yupResolver } from '@hookform/resolvers/yup';
//import * as yup from 'yup';

const ReusableForm = ({
  //schema,
  defaultValues = {},
  fields = [],
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    //resolver: yupResolver(schema),
} = useForm({  defaultValues });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-4"
      noValidate
    >
      {fields.map(({ name, label, type, options, placeholder }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>

          {type === 'select' ? (
            <select
              {...register(name)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{placeholder || 'Select…'}</option>
              {options?.map((o) => (
                <option key={o.value || o} value={o.value || o}>
                  {o.label || o}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              {...register(name)}
              placeholder={placeholder}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <input
              type={type}
              {...register(name)}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {errors[name] && (
            <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md disabled:opacity-50"
      >
        {loading ? 'Loading…' : submitLabel}
      </button>
    </form>
  );
};

export default ReusableForm;