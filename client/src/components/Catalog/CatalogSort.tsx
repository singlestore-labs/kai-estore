import { SearchParamsController } from "@/components/common/SearchParamsController";
import { MenuSelect } from "@/components/common/MenuSelect";

export function CatalogSort() {
  return (
    <SearchParamsController paramName="sort">
      {({ value, onChange }) => (
        <MenuSelect
          title="Sort By"
          value={value}
          options={[
            { label: "Newest", value: "createdAt:-1" },
            { label: "Price: Low-High", value: "price:1" },
            { label: "Price: High-Low", value: "price:-1" },
          ]}
          onChange={onChange}
          listProps={{ zIndex: 2 }}
          placement="bottom-end"
        />
      )}
    </SearchParamsController>
  );
}
