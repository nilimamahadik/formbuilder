import { useState } from "react";
import { componentCategories, componentTypes } from "@/lib/drag-drop";
import { useFormBuilder } from "@/lib/form-builder-context";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ComponentPalette() {
  const [collapsed, setCollapsed] = useState(false);
  const { addField } = useFormBuilder();

  const handleComponentClick = (componentType: typeof componentTypes[0]) => {
    addField({
      type: componentType.type,
      ...componentType.defaultProps,
    });
  };

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="font-semibold text-gray-900">Components</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {componentCategories.map((category) => (
          <div key={category.title} className={cn(
            "p-4",
            category.title !== "Basic Inputs" && "border-t border-gray-100"
          )}>
            {!collapsed && (
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                {category.title}
              </h3>
            )}
            <div className="space-y-2">
              {category.types.map((type) => {
                const component = componentTypes.find(c => c.type === type);
                if (!component) return null;

                return (
                  <div
                    key={type}
                    className="drag-item bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    onClick={() => handleComponentClick(component)}
                  >
                    <div className="flex items-center space-x-3">
                      <i className={`fas ${component.icon} component-icon text-gray-600 min-w-[20px]`} />
                      {!collapsed && (
                        <div className="component-text">
                          <div className="text-sm font-medium text-gray-900">
                            {component.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {component.description}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
