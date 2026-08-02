import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';
import type { Category } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<Category | null>(null);
  const [name, setName]           = useState('');

  const { data: categories, isLoading } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => editing ? updateCategory(editing.id, name) : createCategory(name),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal(); },
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const openCreate = () => { setEditing(null); setName(''); setShowModal(true); };
  const openEdit   = (c: Category) => { setEditing(c); setName(c.name); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setName(''); };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <Button onClick={openCreate}>+ Add Category</Button>
      </div>
      {isLoading ? <p className="text-gray-400">Loading...</p> : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.5fr_0.8fr_1fr] bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-500 md:grid">
            <div>Name</div>
            <div>Items</div>
            <div>Actions</div>
          </div>
          <div className="divide-y divide-gray-100">
            {categories?.map(c => (
              <div key={c.id} className="flex flex-col gap-3 px-4 py-4 md:grid md:grid-cols-[1.5fr_0.8fr_1fr] md:items-center md:px-6">
                <div className="font-medium text-gray-800">{c.name}</div>
                <div className="text-sm text-gray-500">{c.menuItems?.length ?? 0} items</div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => openEdit(c)}>Edit</Button>
                  <Button variant="danger" onClick={() => remove(c.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showModal && (
        <Modal title={editing ? 'Edit Category' : 'New Category'} onClose={closeModal}>
          <div className="space-y-4">
            <Input label="Category Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Burgers" />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button loading={saving} onClick={() => save()}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}