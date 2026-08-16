import { useSchools } from "@/context/SchoolProvider";
import { Card, ScrollShadow, Checkbox, CheckboxContent, Button, ColorSwatch, ProgressCircle } from "@heroui/react";


export function SideBar() {
    const { categories, colorForCategories, selectedCategories, loading, error, toggleSelection, addRemoveAll } = useSchools();

    if (loading) {
        return (
            <ProgressCircle isIndeterminate aria-label="Loading">
                <ProgressCircle.Track>
                    <ProgressCircle.TrackCircle />
                    <ProgressCircle.FillCircle />
                </ProgressCircle.Track>
            </ProgressCircle>
        );
    }

    return error !== null
        ? (
            <Card>
                <Card.Content>
                    <Card.Title>
                        {error}
                    </Card.Title>
                </Card.Content>

            </Card>
        ) : (
            <Card className="w-100 min-h-0" variant="tertiary">
                <Card.Header>
                    <Card.Title>
                        Select school district
                    </Card.Title>
                    <Card.Description>
                        You can select the district of schools
                    </Card.Description>
                </Card.Header>
                <Card.Content className="flex-1 min-h-0">
                    <ScrollShadow className="px-4 h-full">
                        {
                            Object.keys(categories).map((key) => {
                                return (
                                        <Checkbox
                                            key={key}
                                            className="py-1"
                                            isSelected={(selectedCategories[key] ?? false)}
                                            onClick={() => toggleSelection(key)}
                                        >
                                        <CheckboxContent>
                                            <Checkbox.Control>
                                                <Checkbox.Indicator/>
                                            </Checkbox.Control>
                                            <ColorSwatch aria-label={`${key}`} color={key in colorForCategories ? colorForCategories[key] : "#000000"} size="sm" />
                                            {categories[key]}
                                        </CheckboxContent>
                                    </Checkbox>
                                );
                            })
                        }

                    </ScrollShadow>
                </Card.Content>
                <Card.Footer className="mt-4 flex flex-row gap-2">
                    <Button className="w-full" variant="secondary" onClick={() => addRemoveAll(false)}>
                        Remove All
                    </Button>
                    <Button className="w-full" onClick={() => addRemoveAll(true)}>Add All</Button>
                </Card.Footer>

            </Card>
        )
};

