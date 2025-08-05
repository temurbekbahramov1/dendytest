"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Plus, Minus, Phone, ShoppingCart } from "lucide-react"

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

interface CartItem {
  foodItem: FoodItem
  quantity: number
}

export default function Home() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [language, setLanguage] = useState<"uz" | "ru">("uz")
  const { toast } = useToast()

  useEffect(() => {
    fetchFoodItems()
  }, [])

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("/api/food-items")
      if (response.ok) {
        const data = await response.json()
        setFoodItems(data)
      }
    } catch (error) {
      console.error("Error fetching food items:", error)
      // Fallback to mock data if API fails
      const mockFoodItems: FoodItem[] = [
        { id: "1", nameUz: "Hotdog 5 tasi 1 da", nameRu: "Хотдог 5 штук за 1", price: 10000, category: "hotdog", available: true },
        { id: "2", nameUz: "Hotdog 5 tasi 1 da (Big)", nameRu: "Хотдог 5 штук за 1 (Большой)", price: 15000, category: "hotdog", available: true },
        { id: "3", nameUz: "Gamburger 5 tasi 1 da", nameRu: "Гамбургер 5 штук за 1", price: 12000, category: "burger", available: true },
        { id: "4", nameUz: "Chicken Burger 5 tasi 1 da", nameRu: "Чикен Бургер 5 штук за 1", price: 13000, category: "burger", available: true },
        { id: "5", nameUz: "Gamburger", nameRu: "Гамбургер", price: 8000, category: "burger", available: true },
        { id: "6", nameUz: "DablBurger", nameRu: "ДаблБургер", price: 15000, category: "burger", available: true },
        { id: "7", nameUz: "Chizburger", nameRu: "Чизбургер", price: 9000, category: "burger", available: true },
        { id: "8", nameUz: "DablChizburger", nameRu: "ДаблЧизбургер", price: 17000, category: "burger", available: true },
        { id: "9", nameUz: "ChickenDog 5 tasi 1 da", nameRu: "ЧикенДог 5 штук за 1", price: 11000, category: "hotdog", available: true },
        { id: "10", nameUz: "Hot-Dog", nameRu: "Хот-Дог", price: 7000, category: "hotdog", available: true },
        { id: "11", nameUz: "Hot-Dog (big)", nameRu: "Хот-Дог (большой)", price: 10000, category: "hotdog", available: true },
        { id: "12", nameUz: "Kartoshka Fri", nameRu: "Картошка Фри", price: 6000, category: "sides", available: true },
        { id: "13", nameUz: "Coca Cola 0.5", nameRu: "Кока Кола 0.5", price: 4000, category: "drinks", available: true },
        { id: "14", nameUz: "ChickenBurger", nameRu: "ЧикенБургер", price: 10000, category: "burger", available: true },
        { id: "15", nameUz: "IceCoffee", nameRu: "АйсКофе", price: 8000, category: "drinks", available: true },
        { id: "16", nameUz: "Klab Sendwich", nameRu: "Клаб Сэндвич", price: 14000, category: "sandwich", available: true },
        { id: "17", nameUz: "Klab Sendwich Fri bilan", nameRu: "Клаб Сэндвич с Фри", price: 18000, category: "combo", available: true },
        { id: "18", nameUz: "Fri va Cola", nameRu: "Фри и Кола", price: 10000, category: "combo", available: true },
        { id: "19", nameUz: "Naggets 4", nameRu: "Наггетсы 4", price: 8000, category: "sides", available: true },
        { id: "20", nameUz: "Naggets 8", nameRu: "Наггетсы 8", price: 14000, category: "sides", available: true },
        { id: "21", nameUz: "Strips", nameRu: "Стрипсы", price: 12000, category: "sides", available: true },
        { id: "22", nameUz: "Moxito Classic", nameRu: "Мохито Классик", price: 9000, category: "drinks", available: true },
        { id: "23", nameUz: "Combo 2", nameRu: "Комбо 2", price: 20000, category: "combo", available: true },
        { id: "24", nameUz: "Chizburger set 4", nameRu: "Чизбургер сет 4", price: 25000, category: "combo", available: true },
        { id: "25", nameUz: "Gigant Hot-Dog", nameRu: "Гигант Хот-Дог", price: 12000, category: "hotdog", available: true },
        { id: "26", nameUz: "Ice-Tea", nameRu: "Айс-Ти", price: 5000, category: "drinks", available: true },
      ]
      setFoodItems(mockFoodItems)
    }
  }

  const addToCart = (foodItem: FoodItem) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.foodItem.id === foodItem.id)
      if (existingItem) {
        return prev.map(item =>
          item.foodItem.id === foodItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, { foodItem, quantity: 1 }]
      }
    })
    toast({
      title: language === "uz" ? "Qo'shildi" : "Добавлено",
      description: language === "uz" ? `${foodItem.nameUz} savatchaga qo'shildi` : `${foodItem.nameRu} добавлен в корзину`,
    })
  }

  const removeFromCart = (foodItemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.foodItem.id === foodItemId)
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.foodItem.id === foodItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      } else {
        return prev.filter(item => item.foodItem.id !== foodItemId)
      }
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0)
  }

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: language === "uz" ? "Xatolik" : "Ошибка",
        description: language === "uz" ? "Savatcha bo'sh" : "Корзина пуста",
        variant: "destructive",
      })
      return
    }

    try {
      const orderData = {
        totalPrice: getTotalPrice(),
        paymentMethod,
        items: cart.map(item => ({
          foodItemId: item.foodItem.id,
          quantity: item.quantity,
          price: item.foodItem.price,
        })),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        toast({
          title: language === "uz" ? "Buyurtma qabul qilindi" : "Заказ принят",
          description: language === "uz" ? "Buyurtmangiz muvaffaqiyatli qabul qilindi" : "Ваш заказ успешно принят",
        })
        setCart([])
        setShowCheckout(false)
      } else {
        throw new Error("Order failed")
      }
    } catch (error) {
      toast({
        title: language === "uz" ? "Xatolik" : "Ошибка",
        description: language === "uz" ? "Buyurtma berishda xatolik yuz berdi" : "Произошла ошибка при оформлении заказа",
        variant: "destructive",
      })
    }
  }

  const makePhoneCall = () => {
    window.open("tel:+998884591819", "_self")
  }

  const refreshFoodItems = () => {
    fetchFoodItems()
    toast({
      title: language === "uz" ? "Yangilandi" : "Обновлено",
      description: language === "uz" ? "Mahsulotlar yangilandi" : "Продукты обновлены",
    })
  }

  const categories = ["hotdog", "burger", "sandwich", "sides", "drinks", "combo"]
  const categoryNames = {
    uz: { hotdog: "Hotdog", burger: "Burger", sandwich: "Sendvich", sides: "Qo'shimchalar", drinks: "Ichimliklar", combo: "Kombo" },
    ru: { hotdog: "Хотдог", burger: "Бургер", sandwich: "Сэндвич", sides: "Дополнения", drinks: "Напитки", combo: "Комбо" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">DendyFood</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={language === "uz" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("uz")}
                className="text-xs"
              >
                UZ
              </Button>
              <Button
                variant={language === "ru" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("ru")}
                className="text-xs"
              >
                RU
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshFoodItems}
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline">{language === "uz" ? "Yangilash" : "Обновить"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={makePhoneCall}
                className="flex items-center gap-1"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "uz" ? "Telefon qilish" : "Позвонить"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = "/admin"}
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline">{language === "uz" ? "Admin" : "Админ"}</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowCheckout(!showCheckout)}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {showCheckout ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {language === "uz" ? "Buyurtma" : "Заказ"}
                </h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.foodItem.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{language === "uz" ? item.foodItem.nameUz : item.foodItem.nameRu}</p>
                        <p className="text-sm text-gray-600">
                          {item.foodItem.price.toLocaleString()} {language === "uz" ? "so'm" : "сум"} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.foodItem.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToCart(item.foodItem)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="mb-4">
                  <p className="text-lg font-semibold">
                    {language === "uz" ? "Jami:" : "Итого:"} {getTotalPrice().toLocaleString()} {language === "uz" ? "so'm" : "сум"}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="font-medium mb-2">
                    {language === "uz" ? "To'lov usuli:" : "Способ оплаты:"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={paymentMethod === "cash" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("cash")}
                      className="flex-1"
                    >
                      {language === "uz" ? "Naqd pul" : "Наличные"}
                    </Button>
                    <Button
                      variant={paymentMethod === "card" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("card")}
                      className="flex-1"
                    >
                      {language === "uz" ? "Karta" : "Карта"}
                    </Button>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      {language === "uz" ? "Karta raqamiga pul tashlang:" : "Переведите деньги на номер карты:"}
                    </p>
                    <p className="font-mono text-lg">9860 3501 4506 8143</p>
                    <p className="text-sm text-gray-600 mt-1">Otabek Narimanov</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1"
                  >
                    {language === "uz" ? "Orqaga" : "Назад"}
                  </Button>
                  <Button
                    onClick={placeOrder}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {language === "uz" ? "Buyurtma berish" : "Оформить заказ"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryItems = foodItems.filter(item => item.category === category)
              if (categoryItems.length === 0) return null

              return (
                <section key={category}>
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    {categoryNames[language][category as keyof typeof categoryNames.uz]}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {categoryItems.map((item) => {
                      const cartItem = cart.find(ci => ci.foodItem.id === item.id)
                      const quantity = cartItem?.quantity || 0

                      return (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={language === "uz" ? item.nameUz : item.nameRu}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // If image fails to load, show placeholder
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = `
                                    <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                      <span class="text-white font-bold text-sm">
                                        ${language === "uz" ? item.nameUz.charAt(0) : item.nameRu.charAt(0)}
                                      </span>
                                    </div>
                                  `;
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {language === "uz" ? item.nameUz.charAt(0) : item.nameRu.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-semibold text-xs mb-1 line-clamp-2">
                              {language === "uz" ? item.nameUz : item.nameRu}
                            </h3>
                            {item.description && (
                              <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                            <p className="text-sm font-bold text-orange-600 mb-2">
                              {item.price.toLocaleString()} {language === "uz" ? "so'm" : "сум"}
                            </p>
                            <div className="flex items-center justify-between">
                              {quantity > 0 ? (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-6 h-6 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-6 text-center text-xs font-medium">{quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addToCart(item)}
                                    className="w-6 h-6 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => addToCart(item)}
                                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs"
                                  size="sm"
                                >
                                  {language === "uz" ? "Qo'shish" : "Добавить"}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}