import React from "react";

type TreeNode = {
  condition?: string;
  children?: TreeNode[];
  class?: number;
};

const parseTree = (treeText: string): TreeNode => {
  const lines = treeText
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return { condition: "No data", children: [] };
  }

  const root: TreeNode = { children: [] };
  const stack: { depth: number; node: TreeNode }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    let depth = 0;
    const pipeCount = (line.match(/\|/g) || []).length;
    depth = pipeCount - 1;

    let content = line;
    content = content
      .replace(/^\|+/, "")
      .replace(/^[-\s]+/, "")
      .trim();

    while (content.startsWith("|")) {
      content = content
        .substring(1)
        .replace(/^[-\s]+/, "")
        .trim();
    }

    if (!content) {
      continue;
    }

    const node: TreeNode = {};

    if (
      content.startsWith("class:") ||
      content.startsWith("Class:") ||
      content.match(/^(clase|class)\s*:\s*\d+/i)
    ) {
      const classMatch = content.match(/(\d+)/);
      node.class = classMatch ? parseInt(classMatch[1], 10) : 0;
    } else if (content) {
      node.condition = content;
      node.children = [];
    }

    if (!node.condition && node.class === undefined) {
      continue;
    }

    if (depth === 0) {
      root.children!.push(node);
      stack.length = 0;
      stack.push({ depth, node });
    } else {
      while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
        stack.pop();
      }

      if (stack.length > 0) {
        const parent = stack[stack.length - 1].node;
        if (parent.children) {
          parent.children.push(node);
        } else {
          parent.children = [node];
        }
      } else {
        root.children!.push(node);
      }

      stack.push({ depth, node });
    }
  }

  if (root.children && root.children.length > 1) {
    return {
      condition: "Decision Tree Root",
      children: root.children,
    };
  }

  return root.children![0] || { condition: "Empty tree", children: [] };
};

const TreeNodeView: React.FC<{ node: TreeNode; depth?: number }> = ({
  node,
  depth = 0,
}) => {
  const isLeaf = node.class !== undefined;
  const hasChildren = node.children && node.children.length > 0;
  if (isLeaf) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          bg-blue-50 border-blue-400 text-blue-800 shadow-blue-200
          border-2 rounded-xl p-4 shadow-lg min-w-48 max-w-80 text-center
          transition-all duration-300 hover:shadow-xl transform hover:scale-105
        `}
      >
        {node.condition && (
          <div className="font-semibold text-sm leading-tight">
            {node.condition}
          </div>
        )}
      </div>

      {hasChildren &&
        node.children!.filter((child) => child.class === undefined).length >
          0 && (
          <div className="mt-8 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-500 -top-8"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-500 rounded-full top-0 border-2 border-white"></div>
            {node.children!.filter((child) => child.class === undefined)
              .length > 1 && (
              <div
                className="absolute top-0 bg-gray-500 h-0.5"
                style={{
                  left: "0%",
                  right: "10%",
                }}
              ></div>
            )}

            <div className="flex justify-center items-start">
              <div
                className={`flex ${node.children!.filter((child) => child.class === undefined).length > 2 ? "gap-6" : "gap-12"}`}
              >
                {node.children!.map((child, idx) => {
                  if (child.class !== undefined) {
                    return null;
                  }

                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col items-center"
                    >
                      <div className="w-0.5 h-8 bg-gray-500 mb-4"></div>

                      {node.children!.filter(
                        (child) => child.class === undefined
                      ).length === 2 && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md text-xs font-semibold text-gray-700 border border-gray-300 shadow-sm">
                          {node
                            .children!.filter(
                              (child) => child.class === undefined
                            )
                            .indexOf(child) === 0
                            ? "True"
                            : "False"}
                        </div>
                      )}

                      <TreeNodeView node={child} depth={depth + 1} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export const DecisionTree: React.FC<{ treeText: string }> = ({ treeText }) => {
  let tree: TreeNode;
  try {
    tree = parseTree(treeText);
  } catch (error) {
    console.error("Error parsing tree:", error);
    return (
      <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-red-600 font-semibold text-lg mb-4">
            Error al procesar el árbol
          </div>
          <div className="text-gray-600">
            {error instanceof Error ? error.message : "Error desconocido"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 rounded-lg p-8">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-max">
            <TreeNodeView node={tree} />
          </div>
        </div>
      </div>
    </div>
  );
};
