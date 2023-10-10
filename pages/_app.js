import { useState, useEffect } from 'react'
import '../index.scss'
import DefaultLayout from '@/components/layout/default-layout/index'
import AOS from 'aos'
import 'aos/dist/aos.css'

import { AuthProviderJWT } from '@/context/useAuthJWT'
import { AuthProvider } from '@/context/useAuth'
import { UserProvider } from '@/context/UserInfo'
import { ProductsProvider } from '@/context/product'
import { CategoryProvider } from '@/context/category'
import { CartListProvider } from '@/context/cart'
import { CartListCourseProvider } from '@/context/cart_course'
import { FavProvider } from '@/context/fav'
import { DetailProvider } from '@/context/showProductDetail'
import { CommentProvider } from '@/context/comment'
import { CoursesProvider } from '@/context/course'
import { PaginationProvider } from '@/context/pagination'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    <AuthProviderJWT>
      <AuthProvider>
        <UserProvider>
          <PaginationProvider>
            <ProductsProvider>
              <CoursesProvider>
                <CartListProvider>
                  <CartListCourseProvider>
                    <FavProvider>
                      <CategoryProvider>
                        <DetailProvider>
                          <CommentProvider>
                            {getLayout(<Component {...pageProps} />)}
                          </CommentProvider>
                        </DetailProvider>
                      </CategoryProvider>
                    </FavProvider>
                  </CartListCourseProvider>
                </CartListProvider>
              </CoursesProvider>
            </ProductsProvider>
          </PaginationProvider>
        </UserProvider>
      </AuthProvider>
    </AuthProviderJWT>
  )
}
