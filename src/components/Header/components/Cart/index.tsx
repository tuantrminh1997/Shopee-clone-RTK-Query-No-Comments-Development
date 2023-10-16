// imports:
// react hooks:
import { useMemo } from "react";
// assets:
import emtyCartBackground from "src/assets/shopee-emty-cart-background.png";
// common components:
import { Popover, PopoverOption } from "src/components";
// icons:
import { CartIcon } from "src/icons";
// i18n
import { useTranslation } from "react-i18next";
// types
import { CartPropsType, PurchaseSuccessResponse } from "src/types";
// format currency:
import { formatCurrency } from "src/utils";
// constants:
import { cartTextAttributes, cartConstants, paths } from "src/constants";

export default function Cart({ purchaseList, isLoggedIn }: CartPropsType) {
	// constants
	const { addToCartDefaultTitle, currencyUnit } = cartTextAttributes;
	// số lượng sản phẩm hiển thị trên giỏ hàng
	const { cartProductItemShown } = cartConstants;
	// số lượng loại sản phẩm trong giỏ hàng
	const totalNumberOfPurchaseItems: number | undefined = useMemo(() => purchaseList?.length, [purchaseList]);
	// số lượng sản phẩm trong giỏ hàng bị giấu đi và hiển thị ở góc cuối giỏ hàng
	let restNumberOfProductItemsInCart: number = 0;
	if (totalNumberOfPurchaseItems) {
		restNumberOfProductItemsInCart = totalNumberOfPurchaseItems - cartProductItemShown;
	}
	const isFullCart: boolean = useMemo(
		() => Boolean((purchaseList as PurchaseSuccessResponse[])?.length > 0) && Boolean(isLoggedIn),
		[purchaseList, isLoggedIn],
	);
	const { t } = useTranslation("header");
	return (
		<div className='flex-1 flex items-center justify-center lg:basis-[10%]'>
			<Popover
				isCartComponent
				hoverTarget={
					<div className='flex relative'>
						<CartIcon className='m-auto' />
						{(purchaseList as PurchaseSuccessResponse[])?.length > 0 && (isLoggedIn as boolean) && (
							<div className='absolute h-[23px] w-[36px] top-[-11px] right-[-22px] bg-white text-sm text-[#ee4d2d] flex rounded-2xl border-[0.5px] border-[#ee4d2d] sm:w-[20px] sm:right-[-13px] lowerMobile:right-[-10px]'>
								<span className='m-auto'>{totalNumberOfPurchaseItems}</span>
							</div>
						)}
					</div>
				}
				popoverContent={
					isFullCart ? (
						<div className='shadow-2xl rounded-[2px] overflow-hidden bg-[white] w-[25rem] text-[14px] border xl:w-screen'>
							{/* Vùng tiêu để của hộp Cart */}
							<h3 className='pl-[10px] justify-between pr-[10px] font-normal h-[2.5rem] text-[rgba(0,0,0,.26)] flex items-center capitalize'>
								{t("header.recently added products")}
							</h3>
							{purchaseList?.slice(0, cartProductItemShown).map((purchaseItem) => (
								<div key={purchaseItem._id} className='w-full flex p-[10px] hover:bg-[#f8f8f8]'>
									<img
										className='w-[2.5rem] h-[2.5rem] border border-[rgba(0,0,0,.09)] flex-shrink-0'
										src={purchaseItem.product.image}
										alt={purchaseItem.product.name}
									/>
									<div className='ml-[10px] overflow-hidden flex-1'>
										<div className='flex items-center'>
											<span className='overflow-hidden text-ellipsis font-medium whitespace-nowrap'>{purchaseItem.product.name}</span>
											<div className='flex-1'></div>
											<div className='ml-10 flex items-center'>
												<span className='text-[#ee4d2d] relative'>
													<span className='underline text-[10px] absolute top-0 left-0 mt-[1.5px] -ml-[7.5px]'>{currencyUnit}</span>
													{formatCurrency(purchaseItem.product.price)}
												</span>
											</div>
										</div>
									</div>
								</div>
							))}
							<div className='leading-[2.5rem] bg-[#fdfdfd] text-center text-[0.75rem] flex items-center p-[10px] justify-between'>
								<div className='font-normal text-[rgba(0,0,0,.26)]'>
									{(restNumberOfProductItemsInCart as number) > 0 && `${restNumberOfProductItemsInCart} ${addToCartDefaultTitle}`}
								</div>
								<PopoverOption
									to={paths.cart}
									containerClassName={"popoverContentCartContainerStyle capitalize rounded-[3px]"}
									title={t("header.view my shopping cart")}
								/>
							</div>
						</div>
					) : (
						<div className='flex flex-col items-center justify-center m-auto shadow-2xl rounded-[2px] overflow-hidden bg-[white] w-[25rem] min-h-[242px] text-[14px] border xl:w-screen'>
							<img className='w-[100px] h-[100px] mb-2' src={emtyCartBackground} alt='emtyCartBackground' />
							<span className='text-sm text-[#000000CC] capitalize'>{t("header.no products yet")}</span>
						</div>
					)
				}
				offsetValue={10}
				popoverArrowClassName='absolute translate-y-[-80%] translate-x-[0]'
			/>
		</div>
	);
}
