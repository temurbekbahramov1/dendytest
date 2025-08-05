"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, LogOut, PlusCircle, Upload, Image as ImageIcon } from "lucide-react"

interface FoodItem {
  id: string
  nameUz: string
  nameRu: string
  description?: string
  price: number
  imageUrl?: string
  category: string
  available: boolean
}

export default function AdminDashboard() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
  const [formData, setFormData] = useState({
    nameUz: "",
    nameRu: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "burger",
    available: true,
  })
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
    fetchFoodItems()
  }, [])

  const checkAuth = () => {
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated")
    if (!isAuthenticated) {
      router.push("/admin")
    }
  }

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("/api/food-items")
      if (response.ok) {
        const data = await response.json()
        setFoodItems(data)
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Mahsulotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated")
    router.push("/admin")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingItem ? `/api/food-items/${editingItem.id}` : "/api/food-items"
      const method = editingItem ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: editingItem ? "Muvaffaqiyatli yangilandi" : "Muvaffaqiyatli qo'shildi",
          description: editingItem 
            ? "Mahsulot muvaffaqiyatli yangilandi va asosiy sahifada ko'rinadi" 
            : "Yangi mahsulot muvaffaqiyatli qo'shildi va asosiy sahifada ko'rinadi",
        })
        setIsDialogOpen(false)
        resetForm()
        fetchFoodItems()
      } else {
        throw new Error("Operation failed")
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Amaliyotni bajarishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item)
    setFormData({
      nameUz: item.nameUz,
      nameRu: item.nameRu,
      description: item.description || "",
      price: item.price.toString(),
      imageUrl: item.imageUrl || "",
      category: item.category,
      available: item.available,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Mahsulotni o'chirishni xohlaysizmi? Bu mahsulot asosiy sahifadan ham o'chiriladi.")) return

    try {
      const response = await fetch(`/api/food-items/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Muvaffaqiyatli o'chirildi",
          description: "Mahsulot muvaffaqiyatli o'chirildi va asosiy sahifadan yo'qoldi",
        })
        fetchFoodItems()
      } else {
        throw new Error("Delete failed")
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Mahsulotni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      nameUz: "",
      nameRu: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "burger",
      available: true,
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, imageUrl: data.url })
        toast({
          title: "Rasm yuklandi",
          description: "Rasm muvaffaqiyatli yuklandi",
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Rasmni yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const categories = [
    { value: "hotdog", label: "Hotdog" },
    { value: "burger", label: "Burger" },
    { value: "sandwich", label: "Sendvich" },
    { value: "sides", label: "Qo'shimchalar" },
    { value: "drinks", label: "Ichimliklar" },
    { value: "combo", label: "Kombo" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">DendyFood Admin</h1>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Chiqish
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Mahsulotlar</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Yangi mahsulot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nameUz">Nomi (O'zbekcha)</Label>
                  <Input
                    id="nameUz"
                    value={formData.nameUz}
                    onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameRu">Nomi (Ruscha)</Label>
                  <Input
                    id="nameRu"
                    value={formData.nameRu}
                    onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Tavsif</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Narx</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Rasm URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploading}
                        className="whitespace-nowrap"
                      >
                        {uploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategoriya</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="available">Mavjud</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Bekor qilish
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    {editingItem ? "Yangilash" : "Qo'shish"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {foodItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.nameUz}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {item.nameUz.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{item.nameUz}</h3>
                    <Badge variant={item.available ? "default" : "secondary"}>
                      {item.available ? "Mavjud" : "Mavjud emas"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{item.nameRu}</p>
                  <p className="text-lg font-bold text-orange-600">
                    {item.price.toLocaleString()} so'm
                  </p>
                  <p className="text-xs text-gray-500">
                    {categories.find(c => c.value === item.category)?.label}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {foodItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <PlusCircle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Mahsulotlar mavjud emas
            </h3>
            <p className="text-gray-500 mb-4">
              Yangi mahsulot qo'shish uchun "Yangi mahsulot" tugmasini bosing
            </p>
          </div>
        )}
      </main>
    </div>
  )
}