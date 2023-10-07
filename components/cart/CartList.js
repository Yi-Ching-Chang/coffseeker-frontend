import React, { useState, useEffect, useContext } from 'react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { useCartList } from '@/context/cart'
import { useProducts } from '@/context/product'
import axios from 'axios'

export default function CartList({ step, handleNextStep, setStep }) {
  const { cartListData, setCartListData } = useCartList()
  const { productsData, setProductsData } = useProducts()
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('') // 運送方式
  const [deliveryPrice, setDeliveryPrice] = useState(0) // 運費金額
  const [selectedCoupon, setSelectedCoupon] = useState([]) //選取優惠卷
  const [selectedCouponCode, setSelectedCouponCode] = useState('') //選取優惠卷代碼
  const [discountAmount, setDiscountAmount] = useState(0) //優惠卷金額
  const couponsDataFetch = async () => {
    try {
      const couponResponse = await axios.get(
        'http://localhost:3005/api/coupons'
      )
      const couponsData = couponResponse.data.coupons
      setSelectedCoupon(Array.isArray(couponsData) ? couponsData : [])
    } catch (error) {
      console.error('資料獲取失敗:', error)
    }
  }

  // 購物車列表初次渲染
  useEffect(() => {
    couponsDataFetch()

    const initialData = JSON.parse(localStorage.getItem('cartList'))

    if (initialData) {
      setCartListData(initialData)
    }

    const handleStorageChange = (e) => {
      if (e.key === 'cartList') {
        const updatedData = JSON.parse(e.newValue)
        setCartListData(updatedData)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  //前往結帳
  const handleCheckout = () => {
    if (handleNextStep) {
      handleNextStep() // 調用父組件的處理函數，切換到下一步
    }
    setStep(2) // 切換到第三步
  }
  //處理折扣優惠卷
  const handleCouponChange = (couponCode) => {
    //找到選取的優惠卷
    setSelectedCouponCode(couponCode)
    // 查找所選優惠券數據
    const selectedCouponData = selectedCoupon.find(
      (coupon) => coupon.coupon_code === couponCode
    )
    if (selectedCouponData) {
      if (selectedCouponData.discount_type === '百分比') {
        // 百分比折扣
        const discountPercentage = selectedCouponData.discount_value / 100
        const discountPrice = Math.round(totalPrice * discountPercentage)
        const discount = totalPrice - discountPrice
        setDiscountAmount(discount)
      } else if (selectedCouponData.discount_type === '金額') {
        // 固定金額折扣
        setDiscountAmount(selectedCouponData.discount_value)
      }
    } else {
      // 如果未選擇或未找到優惠券，則重置折扣金額
      setDiscountAmount(0)
    }
  }
  //根據user_id條件來呈現優惠卷選項
  // const renderCouponOptions = () => {
  //   const userId = getUserId() // 請使用實際的函數來獲取使用者的 ID
  //   return (
  //     <select
  //       className="form-select"
  //       id="coupon"
  //       name="coupon"
  //       aria-label="selectCoupon"
  //       value={selectedCouponCode}
  //       onChange={(e) => handleCouponChange(e.target.value)}
  //     >
  //       <option value="">請選擇</option>
  //       {selectedCoupon.map(
  //         (coupon) =>
  //           // 新增條件以檢查 user_id 是否相符
  //           coupon.user_id === userId && (
  //             <option key={coupon.coupon_id} value={coupon.coupon_code}>
  //               {coupon.coupon_name}
  //             </option>
  //           )
  //       )}
  //     </select>
  //   )
  // }

  // 處理商品數量增減
  const handleamountChange = (productId, changeAmount) => {
    const updatedCartData = cartListData.map((product) => {
      if (product.id === productId) {
        const newamount = Math.max(1, product.amount + changeAmount)
        return {
          ...product,
          amount: newamount,
        }
      }
      return product
    })
    setCartListData(updatedCartData)
    localStorage.setItem('cartList', JSON.stringify(updatedCartData))
  }
  //單一商品小計＝價格＊數量
  const productSubtotal = (product) => {
    return product.discountPrice * product.amount
  }
  // 刪除一個商品
  const handleRemoveProduct = (productId) => {
    // localStorage 獲取目前的商品
    const storedProductData = JSON.parse(localStorage.getItem('cartList'))

    // 過濾出不包含要删除的商品
    const updatedCart = storedProductData.filter(
      (item) => item.id !== productId
    )
    // 更新購物車狀態
    setCartListData(updatedCart)

    // 更新localStorage數據
    localStorage.setItem('cartList', JSON.stringify(updatedCart))
  }
  //商品小計
  const [totalPrice, setTotalPrice] = useState(0)
  useEffect(() => {
    const total = cartListData.reduce((total, product) => {
      const subtotal = productSubtotal(product)
      return total + subtotal
    }, 0)

    setTotalPrice(total)
  }, [cartListData])

  const totalProductCount = cartListData.reduce(
    (total, product) => total + product.amount,
    0
  )
  // 商品列表
  const productItems = cartListData.map((product) => (
    <div key={product.id} className="productwrap row py-3">
      <div className="imgContainer col-lg-3 col-sm-4 ">
        <img
          className="img-fluid"
          src={`http://localhost:3005/uploads/${product.image_main}`}
          alt={product.image_main}
        />
      </div>
      <div className="productContent col-lg-9 col-sm-8 text-start my-2">
        <div className="topDetails d-flex pb-5 justify-content-between ">
          <div className="Details d-inline pe-3">
            <div className="productTitle py-1 lh-sm">{product.name}</div>
            <div className="productDescription py-1 fw-medium lh-base">
              {product.description}
            </div>
          </div>
          <div className="d-inline productDelete">
            <button
              className="deleteButton"
              onClick={() => {
                handleRemoveProduct(product.id)
              }}
            >
              <RiDeleteBin5Line className="trash" />
            </button>
          </div>
        </div>
        <div className="productPrice fw-medium fs-5 ">
          <div className="price d-inline text-decoration-line-through fs-6 pe-2">
            ${product.price}
          </div>
          <div className="discountPrice d-inline ">
            ${product.discountPrice}
          </div>
        </div>
        <div className="productQuantityTotal pt-3 align-items-center">
          <div className="btn-group">
            <button
              type="button"
              className="quantityMinus"
              onClick={() => {
                handleamountChange(product.id, -1)
              }}
            >
              <AiOutlineMinus />
            </button>
            <input
              className="form-control forminput text-center"
              type="text"
              name="amount"
              min="0"
              value={product.amount}
              readOnly
            />
            <button
              type="button"
              className="quantityAdd"
              onClick={() => {
                handleamountChange(product.id, 1)
              }}
            >
              <AiOutlinePlus />
            </button>
          </div>
          <div className="productSubtotal d-inline fs-4 fw-bolder">
            NTD${productSubtotal(product)}
          </div>
        </div>
      </div>
    </div>
  ))

  //購物車沒有商品
  if (cartListData.length === 0) {
    return (
      <>
        <div className="cartlist">
          <div className="emptyContainer text-center">
            <img
              className="emptyCart"
              src="/cart-image/emptycart.svg"
              alt="購物車無商品"
            />
            <div className="emptyTitle">您的購物車目前無商品</div>
            <button type="button" className="btn goshop">
              <a href="/pages/product">前往商城</a>
            </button>
          </div>
        </div>
      </>
    )
  }

  //購物車有商品
  return (
    <>
      <div className="cartlist py-5">
        {/* 商品表單 */}
        <div className="productscart pb-5">
          <div className="labels">商品項目（{productItems.length}）</div>
          <div className="products container text-center">{productItems}</div>
          <div className="productsFoot text-end fw-bolder">
            商品小計：${totalPrice}
          </div>
        </div>
        {/* 資訊表單 */}
        <div className="infos container pb-5">
          <div className="infoWrap row">
            {/* 選擇送貨及付款方式 */}
            <div className="selectWrap col-lg-6 px-4">
              <div className="labels">選擇送貨及付款方式</div>
              <div className="infoItems">
                <div className="selects">
                  <div className="selectTitle">選擇運送方式：</div>
                  <select
                    required
                    class="form-select"
                    id="deliveryLabel"
                    name="deliveryLabel"
                    aria-label="select"
                    value={selectedDeliveryOption}
                    onChange={(e) => {
                      const selectedOption = e.target.value
                      setSelectedDeliveryOption(selectedOption)

                      // 根據所選的運送方式更新運費
                      let updatedDeliveryPrice = 0
                      if (selectedOption === 'delivery') {
                        updatedDeliveryPrice = 60 // 宅配運費為60元
                      } else if (
                        selectedOption === '711Store' ||
                        selectedOption === 'familyStore'
                      ) {
                        updatedDeliveryPrice = 80 // 7-11或全家便利商店運費
                      }
                      setDeliveryPrice(updatedDeliveryPrice)
                    }}
                  >
                    <option value="">請選擇</option>
                    <option value="delivery">宅配 NT$60</option>
                    <option value="711Store">7-11取貨 NT$80</option>
                    <option value="familyStore">全家取貨 NT$80</option>
                  </select>
                </div>
                <div className="selects">
                  <div className="selectTitle">選擇付款方式：</div>
                  <select
                    required
                    className="form-select"
                    id="paymentLabel"
                    name="paymentLabel"
                    aria-label="選擇付款方式"
                  >
                    <option selected>請選擇</option>
                    <option value="creditCard">信用卡</option>
                    <option value="ATM">ATM轉帳</option>
                  </select>
                </div>
              </div>
            </div>
            {/* 付款資訊 */}
            <div className="paymentWrap col-lg-6 px-4">
              <div className="labels">付款資訊</div>
              <div className="payItems">
                <div className="items d-flex justify-content-between">
                  <div className="payTitle">數量</div>
                  <div className="payText">共 {totalProductCount} 項商品</div>
                </div>
                <div className="items d-flex justify-content-between">
                  <div className="payTitle">金額</div>
                  <div className="payText">${totalPrice}</div>
                </div>
                <div className="items d-flex justify-content-between align-items-center">
                  <div className="payTitle">優惠卷</div>
                  <select
                    className="form-select payText w-75"
                    id="coupon"
                    name="coupon"
                    aria-label="selectCoupon"
                    value={selectedCouponCode}
                    onChange={(e) => handleCouponChange(e.target.value)}
                  >
                    <option value="">請選擇</option>
                    {selectedCoupon.map((coupon) => (
                      <option key={coupon.coupon_id} value={coupon.coupon_code}>
                        {coupon.coupon_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="items d-flex justify-content-between">
                  <div className="payTitle">優惠卷折扣</div>
                  <div className="payText">-${discountAmount}</div>
                </div>
                <div className="items d-flex justify-content-between">
                  <div className="payTitle">運費</div>
                  <div className="payText">${deliveryPrice}</div>
                </div>
                <hr className="items border-1 opacity-100 m-0" />
                <div className="items d-flex justify-content-between pb-3 fs-4 fw-bold">
                  <div className="payTitle">合計</div>
                  <div className="payText">
                    ${totalPrice - discountAmount + deliveryPrice}
                  </div>
                </div>
                <div className="items p-0">
                  <button className="btn goCheckout" onClick={handleCheckout}>
                    前往結賬
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
