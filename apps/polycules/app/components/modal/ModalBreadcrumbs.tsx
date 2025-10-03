import { Breadcrumbs, Stack, Text, type BreadcrumbsProps } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import type { MODALS } from "../../modals";

export const ModalBreadcrumbs = (props: Omit<BreadcrumbsProps, "children">) => {
    const { getPerson, getSystem } = usePolyculeStore();
    const { modals } = useModals();

    const items = modals.map((modal) => {
        let label = "";

        if(modal.type == "context") {
            let ctx = modal.ctx as keyof typeof MODALS;

            if(ctx == "PersonListModal") label = "People";
            if(ctx == "SystemListModal") label = "Systems";
            
            if(ctx == "LinksListModal") label = "Relationships";
            if(ctx == "SystemMembersListModal") label = "Members";
            if(ctx == "NodeSelectModal") label = "Select";
            
            if(ctx == "PersonModal") label = getPerson((modal.props.innerProps as any).id)?.name || "(unnamed)";
            if(ctx == "SystemModal") label = getSystem((modal.props.innerProps as any).id)?.name || "(unnamed)";
            
            if(ctx == "PersonEditorModal") label = "Edit";
            if(ctx == "SystemEditorModal") label = "Edit";
            if(ctx == "RelationshipEditorModal") label = "Edit";
        }

        return (
            <Text inline span fz="xs">
                {label}
            </Text>
        );
    });

    return (
        <Breadcrumbs separatorMargin={4} separator="›" {...props}>
            {items}
        </Breadcrumbs>
    );
};
