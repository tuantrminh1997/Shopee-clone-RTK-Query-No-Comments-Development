/* eslint-disable @typescript-eslint/no-explicit-any */
// clasName:
import classNames from "classnames";
// react-router-dom
import { createSearchParams, useNavigate } from "react-router-dom";
// lodash:
import omit from "lodash/omit";
// react hook form
import { useForm, Controller } from "react-hook-form";
// yupResolver
import { yupResolver } from "@hookform/resolvers/yup";
// icons:
import { CategoryListIcon, FilterIcon, RightArrowIcon } from "src/icons";
// types
import { AsideFilterPropsType, FilterPriceFormData } from "src/types";
// constants:
import { paths } from "src/constants";
// Sử dụng schema filter đã định nghĩa để Validate form khi nhập khoảng giá:
import { filterPriceSchema } from "src/utils";
// react i18n:
import { useTranslation } from "react-i18next";
// components:
import { Button, InputNumber, RatingStarsFilter } from "src/components";

export default function AsideFilter({ categoriesData, queryConfig }: AsideFilterPropsType) {
	// react i18n
	// truyền đúng namespace vào useTranslation
	const { t } = useTranslation("productList");

	// constants:
	const { category } = queryConfig;
	// navigate
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		reset: resetFilterForm,
		formState: { errors },
		trigger,
	} = useForm<FilterPriceFormData>({
		defaultValues: {
			// name phải trùng với 1 thuộc tính trong type được truyền vào Generic Parameter của useForm, ở đây là FilterPriceFormData
			priceMin: "",
			priceMax: "",
		},
		resolver: yupResolver<FilterPriceFormData>(filterPriceSchema as any),
		shouldFocusError: true,
	});

	// Hàm submitForm
	const onSubmit = handleSubmit(
		// callback được gọi khi submit form hợp lệ với Schema
		(filterFormData) => {
			// filterFormData.priceMax?.ref.focus();
			navigate({
				pathname: paths.defaultPath,
				search: createSearchParams({
					// thay đổi path url -> queryConfig thay đổi -> component ProductList re-render và cập nhật lại queryConfig -> truyền xuống các component con
					...queryConfig,
					price_min: filterFormData.priceMin,
					price_max: filterFormData.priceMax,
				}).toString(),
			});
		},
	);

	// Hàm quản lý chức năng xoá tất cả filter tại AsideFilter:
	const handleRemoveAllFilterParams: () => void = () => {
		resetFilterForm(),
			// xoá: category, price_min, price_max, rating_filter
			navigate({
				pathname: paths.defaultPath,
				search: createSearchParams(
					omit(
						{
							...queryConfig,
						},
						["category", "price_min", "price_max", "rating_filter"],
					),
				).toString(),
			});
	};

	return (
		<div className='flex flex-col mr-5 mb-5 min-h-[200px] w-48 flex-none lg:hidden'>
			<Button
				childrenClassName={"flex items-center "}
				to={{
					// -> khi ấn vào tấT cả danh mục -> quay về url / và xoá query params category
					pathname: paths.defaultPath,
					search: createSearchParams(
						omit(
							{
								...queryConfig,
							},
							["category"],
						),
					).toString(),
				}}
				className={classNames(
					"flex border-b border-[rgba(0,0,0,.05)] w-full items-center justify-items-start min-h-[52px] mb-[10px] cursor-pointer",
					{
						// mặc định khi chưa có category -> active tất cả danh mục
						"text-[#EE4D2D]": !category,
					},
				)}
			>
				<CategoryListIcon fill={!category ? "#EE4D2D" : "black"} className='mr-[10px]' />
				<span className='text-base font-bold capitalize'>{t("aside filter.all categories")}</span>
			</Button>
			{/* Filter theo Categories */}
			<div className='text-sm'>
				{categoriesData?.map((categoryItem) => {
					const isActive = category === categoryItem._id;
					return (
						<Button
							childrenClassName={"flex items-center "}
							to={{
								pathname: paths.defaultPath,
								search: createSearchParams({
									...queryConfig,
									category: categoryItem._id,
								}).toString(),
							}}
							key={categoryItem._id}
							className={classNames("py-2 pl-3 pr-[10px] cursor-pointer", {
								"text-[#EE4D2D]": isActive,
							})}
						>
							<RightArrowIcon fill={isActive ? "#EE4D2D" : "none"} />
							<span className='ml-2 capitalize'>{categoryItem.name}</span>
						</Button>
					);
				})}
			</div>
			<div className='flex border-b border-[rgba(0,0,0,.05)] w-full items-center justify-items-start min-h-[52px] mb-[10px]'>
				<FilterIcon className='mr-[10px]' />
				<span className='text-base font-bold capitalize'>{t("aside filter.filter search")}</span>
			</div>
			{/* Vùng filter theo khoảng giá */}
			<form className='flex flex-col border-b border-[rgba(0,0,0,.05)] py-5 w-full' onSubmit={onSubmit}>
				<span className='text-sm font-medium mb-[10px] capitalize'>{t("aside filter.price range")}</span>
				<div className='flex justify-between flex-col mt-5 mb-[5px] items-center w-full h-[70px]'>
					<div className='flex items-center justify-between w-full basis-[45%]'>
						<Controller
							control={control}
							name='priceMin'
							render={({ field }) => (
								<InputNumber
									classNameInput={
										"w-20 h-8 bg-[#fff] border border-[rgba(0,0,0,.26)] shadow-slate-600 rounded-sm  pl-1 pr-[2px] py-[2px] text-xs outline-none uppercase"
									}
									type='text'
									placeholder={t("aside filter.min")}
									{...field}
									onChange={(event: any) => {
										field.onChange(event);
										trigger("priceMax");
									}}
								/>
							)}
						/>
						<div className='h-[0.5px] w-3 bg-[#bdbdbd]'></div>
						<Controller
							// form control nhận diện cấu trúc form thông qua generic type truyền vào useForm, cụ thể ở đây là FilterPriceFormData
							control={control}
							// name phải khớp với cấu trúc của type được truyền vào Generic Parameter của useForm, ở đây là FilterPriceFormData
							name='priceMax'
							render={({ field }) => (
								<InputNumber
									classNameInput={
										"w-20 h-8 bg-[#fff] border border-[rgba(0,0,0,.26)] shadow-slate-600 rounded-sm pl-1 pr-[2px] py-[2px] text-xs outline-none uppercase"
									}
									type={"text"}
									placeholder={t("aside filter.max")}
									{...field}
									onChange={(event: any) => {
										field.onChange(event);
										trigger("priceMin");
									}}
								/>
							)}
						/>
					</div>
					<div className='flex justify-between items-center w-full basis-[45%] text-[11px] text-[#EE4D2D]'>
						<span className='text-center'>{errors ? errors.priceMin?.message : ""}</span>
					</div>
				</div>
				<button className=' flex justify-center items-center py-[6px] uppercase text-white bg-[#ee4d2d] rounded-sm' type='submit'>
					{t("aside filter.apply")}
				</button>
			</form>
			{/* Vùng Filer theo Rating Star */}
			<div className='flex flex-col border-b border-[rgba(0,0,0,.05)] py-5 w-full'>
				<span className='text-sm font-medium mb-[10px] capitalize'>{t("aside filter.rating")}</span>
				{/* <RatingStar /> */}
				<RatingStarsFilter t={t("aside filter.up") as string} queryConfig={queryConfig} />
			</div>
			{/* Button Xoá tất cả */}
			<button
				className='mt-[20px] flex justify-center items-center py-[6px] uppercase text-white bg-[#ee4d2d] rounded-sm'
				onClick={handleRemoveAllFilterParams}
			>
				{t("aside filter.clear all")}
			</button>
		</div>
	);
}
