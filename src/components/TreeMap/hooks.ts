import { treemap, hierarchy, treemapSquarify } from "d3-hierarchy";
import { CustomHierarchyRectangularNode } from "./TreeMap";

interface TreeMapContext<TreeMapInputData> {
  width: number;
  height: number;
  data: TreeMapInputData;
  valuePropInData: string;
  paddingOuter: (depth: number) => number;
  paddingTop: (depth: number) => number;
}

// Todo. useMemo once TreeMap is refactored to functional component
export const useTreeMap = <TreeMapInputData>({
  width,
  height,
  data,
  valuePropInData,
  paddingOuter,
  paddingTop,
}: TreeMapContext<TreeMapInputData>): CustomHierarchyRectangularNode<TreeMapInputData> => {
  const d3TreeMap = treemap<TreeMapInputData>()
    .tile(treemapSquarify.ratio(1))
    .size([width, height])
    .round(true)
    .paddingOuter((node) => paddingOuter(node.depth))
    .paddingTop((node) => paddingTop(node.depth))(
      hierarchy(data)
        .sum((s) => s[valuePropInData])
        .sort((a, b) => b[valuePropInData] - a[valuePropInData])
    );

  let numberItemId = 0;
  const customNodes = d3TreeMap.each(
    (item: CustomHierarchyRectangularNode<TreeMapInputData>) => {
      item.customId = numberItemId++;
    }
  ) as CustomHierarchyRectangularNode<TreeMapInputData>;

  return customNodes;
};
