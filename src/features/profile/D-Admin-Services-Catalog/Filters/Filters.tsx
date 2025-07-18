import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import style from "./Filters.module.sass";
import ArrowIconSrc from "@/features/profile/SupportTicketsChat/assets/ArrowBottom.svg";
import shape from "./assets/shape.svg";
import line from "./assets/line.svg";
import RangeSlider from "./Range/Range.tsx";

type FilterItem = {
	label: string;
	value: string;
	children?: FilterItem[];
};

type FilterSection = {
	key: string;
	title: string;
	type: "simple" | "nested";
	items: FilterItem[];
};

const sections: FilterSection[] = [
	{
		key: "availability",
		title: "Availability",
		type: "simple",
		items: [
			{ label: "In stock (38)", value: "in_stock" },
			{ label: "Out of stock (0)", value: "out_stock" },
		],
	},
	{
		key: "product_type",
		title: "Product type",
		type: "nested",
		items: [
			{
				label: "Baby tee (12)",
				value: "baby_tee",
				children: [
					{ label: "Product 1", value: "product_1" },
					{ label: "Product 2", value: "product_2" },
				],
			},
			{
				label: "Baby tee (12)",
				value: "men",
				children: [
					{ label: "Product 1", value: "product_1" },
					{ label: "Product 2", value: "product_2" },
				],
			},
			{ label: "Cropped pullover (1)", value: "cropped_pullover" },
			{ label: "T-Shirt (13)", value: "tshirt" },
			{ label: "Tank top (12)", value: "tank_top" },
		],
	},

	{
		key: "Color",
		title: "Color",
		type: "nested",
		items: [
			{ label: "Black (13)", value: "Black (13)" },
			{ label: "Lavender (13)", value: "Lavender (13)" },
			{ label: "Natural (13)", value: "Natural (13)" },
			{ label: "Natural/Blue (13)", value: "Natural/Blue (13)" },
		],
	},
	{
		key: "Size",
		title: "Size",
		type: "nested",
		items: [
			{ label: "Xs", value: "Xs" },
			{ label: "Small", value: "Small" },
			{ label: "Medium", value: "Medium" },
			{ label: "Large", value: "Large" },
		],
	},
	{
		key: "Product subtitle",
		title: "Product subtitle",
		type: "nested",
		items: [
			{
				label: "Aries zodiac sign crop top (1)",
				value: "Aries zodiac sign crop top (1)",
			},
			{
				label: "Aries zodiac sign crop top (1)",
				value: "Aries zodiac sign crop top (1)",
			},
			{
				label: "Aries zodiac sign crop top (1)",
				value: "Aries zodiac sign crop top (1)",
			},
			{
				label: "Aries zodiac sign crop top (1)",
				value: "Aries zodiac sign crop top (1)",
			},
		],
	},
];

export default function FilterPanel() {
	const sectionsBeforePrice = sections.slice(0, 1);
	const sectionsAfterPrice = sections.slice(1);
	const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
	const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
	const [openNested, setOpenNested] = useState<Record<string, boolean>>({});
	// RANGE
	const [rangeValue, setRangeValue] = useState<number[]>([0, 200]);

	//price
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [priceFilter, setPriceFilter] = useState(""); // для відображення у вибраних фільтрах

	// Кількість товарів
	const [goodsRange, setGoodsRange] = useState<number[]>([0, 200]);
	const [goodsMin, setGoodsMin] = useState("");
	const [goodsMax, setGoodsMax] = useState("");
	const [goodsFilter, setGoodsFilter] = useState("");

	const handleClear = () => {
		setPriceFilter("");
		setGoodsFilter("");
		setSelectedFilters([]);
		setMinPrice("");
		setMaxPrice("");
		setGoodsMin("");
		setGoodsMax("");
		setRangeValue([0, 200]);
		setGoodsRange([0, 200]);
	};

	const toggleFilter = (value: string) => {
		setSelectedFilters((prev) =>
			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
		);
	};
	//quat
	useEffect(() => {
		const [min, max] = goodsRange;
		setGoodsMin(min.toString());
		setGoodsMax(max.toString());
		setGoodsFilter(`Quantity: ${min} - ${max}`);
	}, [goodsRange]);

	useEffect(() => {
		const handler = setTimeout(() => {
			if (goodsMin || goodsMax) {
				const label = `Quantity: ${goodsMin || "0"} - ${goodsMax || "∞"}`;
				setGoodsFilter(label);
			} else {
				setGoodsFilter("");
			}
		}, 1500);

		return () => clearTimeout(handler);
	}, [goodsMin, goodsMax]);

	// Обробка input'ів прайсу
	useEffect(() => {
		const [min, max] = rangeValue;
		setMinPrice(min.toString());
		setMaxPrice(max.toString());
		setPriceFilter(`Price: ${min} - ${max}`);
	}, [rangeValue]);

	useEffect(() => {
		const handler = setTimeout(() => {
			if (minPrice || maxPrice) {
				const label = `Price: ${minPrice || "0"} - ${maxPrice || "∞"}`;
				setPriceFilter(label);
			} else {
				setPriceFilter("");
			}
		}, 1500);

		return () => clearTimeout(handler);
	}, [minPrice, maxPrice]);

	const handleMinPriceChange = (value: string) => {
		setMinPrice(value);
		const parsed = parseInt(value);
		const maxParsed = parseInt(maxPrice);

		if (!isNaN(parsed) && (!isNaN(maxParsed) ? parsed <= maxParsed : true)) {
			setRangeValue([parsed, rangeValue[1]]);
		}
	};

	const handleMaxPriceChange = (value: string) => {
		setMaxPrice(value);
		const parsed = parseInt(value);
		const minParsed = parseInt(minPrice);

		if (!isNaN(parsed) && (!isNaN(minParsed) ? parsed >= minParsed : true)) {
			setRangeValue([rangeValue[0], parsed]);
		}
	};
	const handleGoodsMinChange = (value: string) => {
		setGoodsMin(value);
		const parsed = parseInt(value);
		const maxParsed = parseInt(goodsMax);
		if (!isNaN(parsed) && (!isNaN(maxParsed) ? parsed <= maxParsed : true)) {
			setGoodsRange([parsed, goodsRange[1]]);
		}
	};

	const handleGoodsMaxChange = (value: string) => {
		setGoodsMax(value);
		const parsed = parseInt(value);
		const minParsed = parseInt(goodsMin);
		if (!isNaN(parsed) && (!isNaN(minParsed) ? parsed >= minParsed : true)) {
			setGoodsRange([goodsRange[0], parsed]);
		}
	};

	// Функція рендеру секції фільтрів
	const renderSection = (section: FilterSection) => {
		const isOpen = openSections[section.key];

		return (
			<div className={style["filter__main-block"]} key={section.key}>
				{/* Заголовок секції */}
				<div
					className={style["filter__header"]}
					onClick={() =>
						setOpenSections((prev) => ({
							...prev,
							[section.key]: !prev[section.key],
						}))
					}
				>
					<p>{section.title}</p>
					<img
						src={ArrowIconSrc}
						alt=""
						className={`${style["filter__arrow"]} ${isOpen ? style["filter__arrow--open"] : ""}`}
					/>
				</div>

				<AnimatePresence initial={false}>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.25 }}
							style={{
								overflow: "hidden",
								display: "flex",
								flexDirection: "column",
								gap: "16px",
							}}
						>
							{/* Простий список */}
							{section.type === "simple" && (
								<FormGroup style={{ display: "flex", gap: "12px" }}>
									{section.items.map((item) => (
										<FormControlLabel
											key={item.value}
											control={
												<Checkbox
													checked={selectedFilters.includes(item.value)}
													onChange={() => toggleFilter(item.value)}
												/>
											}
											label={
												<span className={style["filter__checkbox-label"]}>
													{item.label}
												</span>
											}
										/>
									))}
								</FormGroup>
							)}

							{/* Вкладені фільтри */}
							{section.type === "nested" && (
								<div className={style["filter__checkboxes"]}>
									{section.items.map((item) => {
										const hasChildren = item.children?.length;
										return (
											<div className={style["filter__wrraper"]} key={item.value}>
												{hasChildren ? (
													<>
														<div
															className={style["filter__checkboxes-block"]}
															onClick={() =>
																setOpenNested((prev) => ({
																	...prev,
																	[item.value]: !prev[item.value],
																}))
															}
														>
															<img
																src={ArrowIconSrc}
																alt=""
																className={`${style["filter__arrow"]} ${
																	openNested[item.value] ? style["filter__arrow--open"] : ""
																}`}
															/>
															<p>{item.label}</p>
														</div>
														<AnimatePresence initial={false}>
															{openNested[item.value] && (
																<motion.div
																	initial={{ opacity: 0, height: 0 }}
																	animate={{ opacity: 1, height: "auto" }}
																	exit={{ opacity: 0, height: 0 }}
																	transition={{ duration: 0.2 }}
																>
																	<FormGroup
																		style={{
																			paddingLeft: 32,
																			display: "flex",
																			flexDirection: "column",
																			gap: "10px",
																		}}
																	>
																		{item.children!.map((child) => (
																			<FormControlLabel
																				key={child.value}
																				control={
																					<Checkbox
																						checked={selectedFilters.includes(child.value)}
																						onChange={() => toggleFilter(child.value)}
																					/>
																				}
																				label={
																					<span className={style["filter__checkbox-label"]}>
																						{child.label}
																					</span>
																				}
																			/>
																		))}
																	</FormGroup>
																</motion.div>
															)}
														</AnimatePresence>
													</>
												) : (
													<FormControlLabel
														control={
															<Checkbox
																checked={selectedFilters.includes(item.value)}
																onChange={() => toggleFilter(item.value)}
															/>
														}
														label={
															<span className={style["filter__checkbox-label"]}>
																{item.label}
															</span>
														}
													/>
												)}
											</div>
										);
									})}
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	};

	return (
		<div className={style.filter}>
			<div className={style.filter__container}>
				<div className={style.filter__title}>
					<p className={style.filter__text}>Filters</p>
					<div onClick={handleClear}>
						<p>Clear all Filters</p>
						<img src={shape} />
					</div>
				</div>

				<div className={style["filter__selected-block"]}>
					<p
						style={{
							marginBottom: selectedFilters.length > 0 || priceFilter ? "8px" : "0",
						}}
					>
						Product type{" "}
					</p>
					{(selectedFilters.length > 0 || priceFilter || goodsFilter) && (
						<div className={style["filter__tags"]}>
							{selectedFilters.map((filter) => (
								<div key={filter} className={style["filter__tag"]}>
									<span>{filter}</span>
									<img onClick={() => toggleFilter(filter)} src={shape} />
								</div>
							))}
							{priceFilter && (
								<div className={style["filter__tag"]}>
									<span>{priceFilter}</span>
									<img
										onClick={() => {
											setMinPrice("");
											setMaxPrice("");
											setPriceFilter("");
											setRangeValue([0, 200]);
										}}
										src={shape}
									/>
								</div>
							)}
							{goodsFilter && (
								<div className={style["filter__tag"]}>
									<span>{goodsFilter}</span>
									<img
										onClick={() => {
											setGoodsMin("");
											setGoodsMax("");
											setGoodsFilter("");
											setGoodsRange([0, 200]);
										}}
										src={shape}
									/>
								</div>
							)}
						</div>
					)}
				</div>
				<div className={style["filter__price"]}>
					<p>Quantity of goods</p>
					<div className={style["filter__price-inputs"]}>
						<div className={style.price}>
							<div className={style.price__block}>
								<div className={style["price__input-block"]}>
									<input
										type="text"
										placeholder="0"
										value={goodsMin}
										onChange={(e) => handleGoodsMinChange(e.target.value)}
										onBlur={() => {
											const min = parseInt(goodsMin);
											const max = parseInt(goodsMax);
											if (!isNaN(min) && !isNaN(max) && min <= max) {
												setGoodsRange([min, max]);
											}
										}}
									/>
								</div>
							</div>
						</div>
						<img src={line} alt="" />
						<div className={style.price}>
							<div className={style.price__block}>
								<div className={style["price__input-block"]}>
									<input
										type="text"
										placeholder="200"
										value={goodsMax}
										onChange={(e) => handleGoodsMaxChange(e.target.value)}
										onBlur={() => {
											const min = parseInt(goodsMin);
											const max = parseInt(goodsMax);
											if (!isNaN(min) && !isNaN(max) && min <= max) {
												setGoodsRange([min, max]);
											}
										}}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className={style["filter__range-block"]}>
						<RangeSlider value={goodsRange} onChange={setGoodsRange} />
					</div>
				</div>

				{/* Фільтри до прайсу */}
				{sectionsBeforePrice.map((section) => renderSection(section))}

				{/* Блок прайсу */}
				<div className={style["filter__price"]}>
					<p>Price Range</p>
					<div className={style["filter__price-inputs"]}>
						<div className={style.price}>
							<div className={style.price__block}>
								<div className={style["price__input-block"]}>
									<input
										type="text"
										placeholder="0"
										value={minPrice}
										onChange={(e) => handleMinPriceChange(e.target.value)}
										onBlur={() => {
											const min = parseInt(minPrice);
											const max = parseInt(maxPrice);
											if (!isNaN(min) && !isNaN(max) && min <= max) {
												setRangeValue([min, max]);
											}
										}}
									/>
								</div>
							</div>
						</div>
						<img src={line} alt="" />
						<div className={style.price}>
							<div className={style.price__block}>
								<div className={style["price__input-block"]}>
									<input
										type="text"
										placeholder="200"
										value={maxPrice}
										onChange={(e) => handleMaxPriceChange(e.target.value)}
										onBlur={() => {
											const min = parseInt(minPrice);
											const max = parseInt(maxPrice);
											if (!isNaN(min) && !isNaN(max) && min <= max) {
												setRangeValue([min, max]);
											}
										}}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className={style["filter__range-block"]}>
						<RangeSlider value={rangeValue} onChange={setRangeValue} />
					</div>
				</div>

				{/* Фільтри після прайсу */}
				{sectionsAfterPrice.map((section) => renderSection(section))}
			</div>
		</div>
	);
}

// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormGroup from "@mui/material/FormGroup";
// import style from "./Filters.module.sass";
// import ArrowIconSrc from "@/features/profile/SupportTicketsChat/assets/ArrowBottom.svg";
// import shape from "./assets/shape.svg";
// import line from "./assets/line.svg";
// import RangeSlider from "./Range/Range.tsx";

// // Типи

// type FilterItem = {
// 	label: string;
// 	value: string;
// 	children?: FilterItem[];
// };

// type FilterSection = {
// 	key: string;
// 	title: string;
// 	type: "simple" | "nested";
// 	items: FilterItem[];
// };

// // Дані фільтрів

// const sections: FilterSection[] = [
// 	{
// 		key: "availability",
// 		title: "Availability",
// 		type: "simple",
// 		items: [
// 			{ label: "In stock (38)", value: "in_stock" },
// 			{ label: "Out of stock (0)", value: "out_stock" },
// 		],
// 	},

// 	{
// 		key: "product_type",
// 		title: "Product type",
// 		type: "nested",
// 		items: [
// 			{
// 				label: "Baby tee (12)",
// 				value: "baby_tee",
// 				children: [
// 					{ label: "Product 1", value: "product_1" },
// 					{ label: "Product 2", value: "product_2" },
// 				],
// 			},
// 			{
// 				label: "Baby tee (12)",
// 				value: "men",
// 				children: [
// 					{ label: "Product 1", value: "product_1" },
// 					{ label: "Product 2", value: "product_2" },
// 				],
// 			},
// 			{ label: "Cropped pullover (1)", value: "cropped_pullover" },
// 			{ label: "T-Shirt (13)", value: "tshirt" },
// 			{ label: "Tank top (12)", value: "tank_top" },
// 		],
// 	},
// ];

// const colorOptions: FilterItem[] = [
// 	{ label: "Black (13)", value: "Black" },
// 	{ label: "Lavender (13)", value: "Lavender" },
// 	{ label: "Natural (13)", value: "Natural" },
// 	{ label: "Natural/Blue (13)", value: "Natural/Blue" },
// ];

// export default function FilterPanel() {
// 	const sectionsBeforePrice = sections.slice(0, 1);
// 	const sectionsAfterQuantity = sections.slice(1, 2);
// 	const sectionsAfterPrice = sections.slice(2);

// 	const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
// 	const [selectedColors, setSelectedColors] = useState<string[]>([]);
// 	const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
// 	const [openNested, setOpenNested] = useState<Record<string, boolean>>({});
// 	const [rangeValue, setRangeValue] = useState<number[]>([0, 200]);
// 	const [quantityValue, setQuantityValue] = useState<number[]>([1, 50]);
// 	const [minPrice, setMinPrice] = useState("");
// 	const [maxPrice, setMaxPrice] = useState("");
// 	const [priceFilter, setPriceFilter] = useState("");

// 	const toggleFilter = (value: string) => {
// 		setSelectedFilters((prev) =>
// 			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
// 		);
// 	};

// 	const toggleColor = (value: string) => {
// 		setSelectedColors((prev) =>
// 			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
// 		);
// 	};

// 	const handleClear = () => {
// 		setPriceFilter("");
// 		setSelectedFilters([]);
// 		setSelectedColors([]);
// 		setMinPrice("");
// 		setMaxPrice("");
// 		setRangeValue([0, 200]);
// 		setQuantityValue([1, 50]);
// 	};

// 	useEffect(() => {
// 		const [min, max] = rangeValue;
// 		setMinPrice(min.toString());
// 		setMaxPrice(max.toString());
// 		setPriceFilter(`Price: ${min} - ${max}`);
// 	}, [rangeValue]);

// 	const renderSection = (section: FilterSection) => {
// 		const isOpen = openSections[section.key];

// 		return (
// 			<div className={style["filter__main-block"]} key={section.key}>
// 				<div
// 					className={style["filter__header"]}
// 					onClick={() =>
// 						setOpenSections((prev) => ({
// 							...prev,
// 							[section.key]: !prev[section.key],
// 						}))
// 					}
// 				>
// 					<p>{section.title}</p>
// 					<img
// 						src={ArrowIconSrc}
// 						alt=""
// 						className={`${style["filter__arrow"]} ${isOpen ? style["filter__arrow--open"] : ""}`}
// 					/>
// 				</div>

// 				<AnimatePresence initial={false}>
// 					{isOpen && (
// 						<motion.div
// 							initial={{ opacity: 0, height: 0 }}
// 							animate={{ opacity: 1, height: "auto" }}
// 							exit={{ opacity: 0, height: 0 }}
// 							transition={{ duration: 0.25 }}
// 							style={{
// 								overflow: "hidden",
// 								display: "flex",
// 								flexDirection: "column",
// 								gap: "16px",
// 							}}
// 						>
// 							{section.type === "simple" && (
// 								<FormGroup style={{ display: "flex", gap: "12px" }}>
// 									{section.items.map((item) => (
// 										<FormControlLabel
// 											key={item.value}
// 											control={
// 												<Checkbox
// 													checked={selectedFilters.includes(item.value)}
// 													onChange={() => toggleFilter(item.value)}
// 												/>
// 											}
// 											label={
// 												<span className={style["filter__checkbox-label"]}>
// 													{item.label}
// 												</span>
// 											}
// 										/>
// 									))}
// 								</FormGroup>
// 							)}
// 						</motion.div>
// 					)}
// 				</AnimatePresence>
// 			</div>
// 		);
// 	};

// 	const renderColorFilterBlock = () => (
// 		<div className={style["filter__main-block"]}>
// 			<div className={style["filter__header"]}>
// 				<p>Colors</p>
// 			</div>
// 			<FormGroup style={{ display: "flex", gap: "12px" }}>
// 				{colorOptions.map((color) => (
// 					<FormControlLabel
// 						key={color.value}
// 						control={
// 							<Checkbox
// 								checked={selectedColors.includes(color.value)}
// 								onChange={() => toggleColor(color.value)}
// 							/>
// 						}
// 						label={
// 							<span className={style["filter__checkbox-label"]}>{color.label}</span>
// 						}
// 					/>
// 				))}
// 			</FormGroup>
// 		</div>
// 	);

// 	return (
// 		<div className={style.filter}>
// 			<div className={style.filter__container}>
// 				<div className={style.filter__title}>
// 					<p className={style.filter__text}>Filters</p>
// 					<div onClick={handleClear}>
// 						<p>Clear all Filters</p>
// 						<img src={shape} />
// 					</div>
// 				</div>

// 				{(selectedFilters.length > 0 || priceFilter) && (
// 					<div className={style["filter__selected-block"]}>
// 						<p>Product type</p>
// 						<div className={style["filter__tags"]}>
// 							{selectedFilters.map((filter) => (
// 								<div key={filter} className={style["filter__tag"]}>
// 									<span>{filter}</span>
// 									<img onClick={() => toggleFilter(filter)} src={shape} />
// 								</div>
// 							))}
// 							{priceFilter && (
// 								<div className={style["filter__tag"]}>
// 									<span>{priceFilter}</span>
// 									<img
// 										onClick={() => {
// 											setMinPrice("");
// 											setMaxPrice("");
// 											setPriceFilter("");
// 											setRangeValue([0, 200]);
// 										}}
// 										src={shape}
// 									/>
// 								</div>
// 							)}
// 						</div>
// 					</div>
// 				)}

// 				{selectedColors.length > 0 && (
// 					<div className={style["filter__selected-block"]}>
// 						<p>Colors</p>
// 						<div className={style["filter__tags"]}>
// 							{selectedColors.map((color) => (
// 								<div key={color} className={style["filter__tag"]}>
// 									<span>{color}</span>
// 									<img onClick={() => toggleColor(color)} src={shape} />
// 								</div>
// 							))}
// 						</div>
// 					</div>
// 				)}

// 				<div className={style["filter__price"]}>
// 					<p>Quantity of goods</p>
// 					<div className={style["filter__price-inputs"]}>
// 						<div className={style.price}>
// 							<div className={style.price__block}>
// 								<div className={style["price__input-block"]}>
// 									<input
// 										type="text"
// 										placeholder="0"
// 										value={minPrice}
// 										onChange={(e) => setMinPrice(e.target.value)}
// 									/>
// 								</div>
// 							</div>
// 						</div>
// 						<img src={line} alt="" />
// 						<div className={style.price}>
// 							<div className={style.price__block}>
// 								<div className={style["price__input-block"]}>
// 									<input
// 										type="text"
// 										placeholder="200"
// 										value={maxPrice}
// 										onChange={(e) => setMaxPrice(e.target.value)}
// 									/>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 					<div className={style["filter__range-block"]}>
// 						<RangeSlider value={quantityValue} onChange={setQuantityValue} />
// 					</div>
// 				</div>
// 				{sectionsBeforePrice.map((section) => renderSection(section))}

// 				{renderColorFilterBlock()}

// 				<div className={style["filter__price"]}>
// 					<p>Price Range</p>
// 					<div className={style["filter__price-inputs"]}>
// 						<div className={style.price}>
// 							<div className={style.price__block}>
// 								<div className={style["price__input-block"]}>
// 									<input
// 										type="text"
// 										placeholder="0"
// 										value={minPrice}
// 										onChange={(e) => setMinPrice(e.target.value)}
// 									/>
// 								</div>
// 							</div>
// 						</div>
// 						<img src={line} alt="" />
// 						<div className={style.price}>
// 							<div className={style.price__block}>
// 								<div className={style["price__input-block"]}>
// 									<input
// 										type="text"
// 										placeholder="200"
// 										value={maxPrice}
// 										onChange={(e) => setMaxPrice(e.target.value)}
// 									/>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 					<div className={style["filter__range-block"]}>
// 						<RangeSlider value={rangeValue} onChange={setRangeValue} />
// 					</div>
// 				</div>

// 				{sectionsAfterQuantity.map((section) => renderSection(section))}
// 			</div>
// 		</div>
// 	);
// }
