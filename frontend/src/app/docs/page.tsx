import { ComponentSection } from "@/components/docs/component-section"

// Design Tokens
import { ColorVariablesDemo } from "@/components/docs/demos/color-variables-demo"
import { ElevationDemo } from "@/components/docs/demos/elevation-demo"
import { TypographyDemo } from "@/components/docs/demos/typography-demo"

// Forms & Inputs
import { ButtonDemo } from "@/components/docs/demos/button-demo"
import { ButtonGroupDemo } from "@/components/docs/demos/button-group-demo"
import { CheckboxDemo } from "@/components/docs/demos/checkbox-demo"
import { ComboboxDemo } from "@/components/docs/demos/combobox-demo"
import { FieldDemo } from "@/components/docs/demos/field-demo"
import { FormDemo } from "@/components/docs/demos/form-demo"
import { InputDemo } from "@/components/docs/demos/input-demo"
import { InputGroupDemo } from "@/components/docs/demos/input-group-demo"
import { InputOtpDemo } from "@/components/docs/demos/input-otp-demo"
import { LabelDemo } from "@/components/docs/demos/label-demo"
import { NativeSelectDemo } from "@/components/docs/demos/native-select-demo"
import { RadioGroupDemo } from "@/components/docs/demos/radio-group-demo"
import { SelectDemo } from "@/components/docs/demos/select-demo"
import { SliderDemo } from "@/components/docs/demos/slider-demo"
import { SwitchDemo } from "@/components/docs/demos/switch-demo"
import { TextareaDemo } from "@/components/docs/demos/textarea-demo"
import { ToggleDemo } from "@/components/docs/demos/toggle-demo"
import { ToggleGroupDemo } from "@/components/docs/demos/toggle-group-demo"

// Layout
import { AspectRatioDemo } from "@/components/docs/demos/aspect-ratio-demo"
import { CardDemo } from "@/components/docs/demos/card-demo"
import { EmptyDemo } from "@/components/docs/demos/empty-demo"
import { ResizableDemo } from "@/components/docs/demos/resizable-demo"
import { ScrollAreaDemo } from "@/components/docs/demos/scroll-area-demo"
import { SeparatorDemo } from "@/components/docs/demos/separator-demo"

// Navigation
import { BreadcrumbDemo } from "@/components/docs/demos/breadcrumb-demo"
import { ContextMenuDemo } from "@/components/docs/demos/context-menu-demo"
import { DropdownMenuDemo } from "@/components/docs/demos/dropdown-menu-demo"
import { MenubarDemo } from "@/components/docs/demos/menubar-demo"
import { NavigationMenuDemo } from "@/components/docs/demos/navigation-menu-demo"
import { PaginationDemo } from "@/components/docs/demos/pagination-demo"
import { SidebarDemo } from "@/components/docs/demos/sidebar-demo"
import { TabsDemo } from "@/components/docs/demos/tabs-demo"

// Display & Data
import { AccordionDemo } from "@/components/docs/demos/accordion-demo"
import { AlertDemo } from "@/components/docs/demos/alert-demo"
import { AvatarDemo } from "@/components/docs/demos/avatar-demo"
import { BadgeDemo } from "@/components/docs/demos/badge-demo"
import { CalendarDemo } from "@/components/docs/demos/calendar-demo"
import { CarouselDemo } from "@/components/docs/demos/carousel-demo"
import { ChartDemo } from "@/components/docs/demos/chart-demo"
import { CollapsibleDemo } from "@/components/docs/demos/collapsible-demo"
import { KbdDemo } from "@/components/docs/demos/kbd-demo"
import { ProgressDemo } from "@/components/docs/demos/progress-demo"
import { SkeletonDemo } from "@/components/docs/demos/skeleton-demo"
import { SpinnerDemo } from "@/components/docs/demos/spinner-demo"
import { TableDemo } from "@/components/docs/demos/table-demo"

// Dialogs & Overlays
import { AlertDialogDemo } from "@/components/docs/demos/alert-dialog-demo"
import { CommandDemo } from "@/components/docs/demos/command-demo"
import { DialogDemo } from "@/components/docs/demos/dialog-demo"
import { DrawerDemo } from "@/components/docs/demos/drawer-demo"
import { HoverCardDemo } from "@/components/docs/demos/hover-card-demo"
import { PopoverDemo } from "@/components/docs/demos/popover-demo"
import { SheetDemo } from "@/components/docs/demos/sheet-demo"
import { TooltipDemo } from "@/components/docs/demos/tooltip-demo"

// Feedback
import { SonnerDemo } from "@/components/docs/demos/sonner-demo"
import { ToastDemo } from "@/components/docs/demos/toast-demo"

export const metadata = {
  title: "Component Documentation",
  description: "Interactive documentation for all shadcn/ui components",
}

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-[length:var(--text-4xl)] font-bold tracking-tight mb-2">
          Component Documentation
        </h1>
        <p className="text-[length:var(--text-lg)] text-muted-foreground">
          Interactive examples for all shadcn/ui components.
        </p>
      </header>

      {/* Design Tokens */}
      <section className="mb-16">
        <h2 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-6" id="design-tokens">
          Design Tokens
        </h2>

        <ComponentSection id="color-variables" title="Color Variables" description="All CSS custom properties used for theming. Swatches update live with the theme config panel.">
          <ColorVariablesDemo />
        </ComponentSection>

        <ComponentSection id="elevation" title="Elevation" description="Shadow levels for conveying visual hierarchy and depth.">
          <ElevationDemo />
        </ComponentSection>

        <ComponentSection id="typography" title="Typography" description="Type scale, font weights, letter spacing, line heights, and text colors.">
          <TypographyDemo />
        </ComponentSection>
      </section>

      {/* Forms & Inputs */}
      <section className="mb-16">
        <h2 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-6" id="forms-inputs">
          Forms & Inputs
        </h2>

        <ComponentSection id="button" title="Button" description="Displays a button or a component that looks like a button.">
          <ButtonDemo />
        </ComponentSection>

        <ComponentSection id="button-group" title="Button Group" description="Groups multiple buttons together with consistent spacing.">
          <ButtonGroupDemo />
        </ComponentSection>

        <ComponentSection id="checkbox" title="Checkbox" description="A control that allows the user to toggle between checked and not checked.">
          <CheckboxDemo />
        </ComponentSection>

        <ComponentSection id="combobox" title="Combobox" description="Autocomplete input and command palette with a list of suggestions.">
          <ComboboxDemo />
        </ComponentSection>

        <ComponentSection id="field" title="Field" description="A form field wrapper providing label, description, and error messages.">
          <FieldDemo />
        </ComponentSection>

        <ComponentSection id="form" title="Form" description="Building forms with React Hook Form and Zod validation.">
          <FormDemo />
        </ComponentSection>

        <ComponentSection id="input" title="Input" description="Displays a form input field for text entry.">
          <InputDemo />
        </ComponentSection>

        <ComponentSection id="input-group" title="Input Group" description="Groups an input with addons like icons or buttons.">
          <InputGroupDemo />
        </ComponentSection>

        <ComponentSection id="input-otp" title="Input OTP" description="Accessible one-time password component with copy/paste support.">
          <InputOtpDemo />
        </ComponentSection>

        <ComponentSection id="label" title="Label" description="Renders an accessible label associated with controls.">
          <LabelDemo />
        </ComponentSection>

        <ComponentSection id="native-select" title="Native Select" description="A native HTML select element with consistent styling.">
          <NativeSelectDemo />
        </ComponentSection>

        <ComponentSection id="radio-group" title="Radio Group" description="A set of checkable buttons where only one can be checked at a time.">
          <RadioGroupDemo />
        </ComponentSection>

        <ComponentSection id="select" title="Select" description="Displays a list of options for the user to pick from, triggered by a button.">
          <SelectDemo />
        </ComponentSection>

        <ComponentSection id="slider" title="Slider" description="An input where the user selects a value from within a given range.">
          <SliderDemo />
        </ComponentSection>

        <ComponentSection id="switch" title="Switch" description="A control that allows the user to toggle between on and off.">
          <SwitchDemo />
        </ComponentSection>

        <ComponentSection id="textarea" title="Textarea" description="Displays a form textarea for multi-line text input.">
          <TextareaDemo />
        </ComponentSection>

        <ComponentSection id="toggle" title="Toggle" description="A two-state button that can be either on or off.">
          <ToggleDemo />
        </ComponentSection>

        <ComponentSection id="toggle-group" title="Toggle Group" description="A set of two-state buttons that can be toggled on or off.">
          <ToggleGroupDemo />
        </ComponentSection>
      </section>

      {/* Layout */}
      <section className="mb-16">
        <h2 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-6" id="layout">
          Layout
        </h2>

        <ComponentSection id="aspect-ratio" title="Aspect Ratio" description="Displays content within a desired ratio.">
          <AspectRatioDemo />
        </ComponentSection>

        <ComponentSection id="card" title="Card" description="Displays a card with header, content, and footer.">
          <CardDemo />
        </ComponentSection>

        <ComponentSection id="empty" title="Empty" description="A placeholder component for empty states.">
          <EmptyDemo />
        </ComponentSection>

        <ComponentSection id="resizable" title="Resizable" description="Accessible resizable panel groups and layouts with handles.">
          <ResizableDemo />
        </ComponentSection>

        <ComponentSection id="scroll-area" title="Scroll Area" description="Augments native scroll functionality for custom cross-browser styling.">
          <ScrollAreaDemo />
        </ComponentSection>

        <ComponentSection id="separator" title="Separator" description="Visually or semantically separates content.">
          <SeparatorDemo />
        </ComponentSection>
      </section>

      {/* Navigation */}
      <section className="mb-16">
        <h2 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-6" id="navigation">
          Navigation
        </h2>

        <ComponentSection id="breadcrumb" title="Breadcrumb" description="Displays the path to the current resource using a hierarchy of links.">
          <BreadcrumbDemo />
        </ComponentSection>

        <ComponentSection id="context-menu" title="Context Menu" description="Displays a menu at the pointer position, activated on right-click.">
          <ContextMenuDemo />
        </ComponentSection>

        <ComponentSection id="dropdown-menu" title="Dropdown Menu" description="Displays a menu triggered by a button.">
          <DropdownMenuDemo />
        </ComponentSection>

        <ComponentSection id="menubar" title="Menubar" description="A visually persistent menu common in desktop applications.">
          <MenubarDemo />
        </ComponentSection>

        <ComponentSection id="navigation-menu" title="Navigation Menu" description="A collection of links for navigating websites.">
          <NavigationMenuDemo />
        </ComponentSection>

        <ComponentSection id="pagination" title="Pagination" description="Navigation controls for paging through content.">
          <PaginationDemo />
        </ComponentSection>

        <ComponentSection id="sidebar" title="Sidebar" description="A composable, themeable sidebar component with support for collapsibility.">
          <SidebarDemo />
        </ComponentSection>

        <ComponentSection id="tabs" title="Tabs" description="A set of layered sections of content known as tab panels.">
          <TabsDemo />
        </ComponentSection>
      </section>

      {/* Display & Data */}
      <section className="mb-16">
        <h2 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-6" id="display-data">
          Display & Data
        </h2>

        <ComponentSection id="accordion" title="Accordion" description="A vertically stacked set of interactive headings that reveal content.">
          <AccordionDemo />
        </ComponentSection>

        <ComponentSection id="alert" title="Alert" description="Displays a callout for important information.">
          <AlertDemo />
        </ComponentSection>

        <ComponentSection id="avatar" title="Avatar" description="An image element with a fallback for representing the user.">
          <AvatarDemo />
        </ComponentSection>

        <ComponentSection id="badge" title="Badge" description="Displays a badge or a component that looks like a badge.">
          <BadgeDemo />
        </ComponentSection>

        <ComponentSection id="calendar" title="Calendar" description="A date field component that allows users to enter and edit date.">
          <CalendarDemo />
        </ComponentSection>

        <ComponentSection id="carousel" title="Carousel" description="A carousel with motion and swipe built using Embla.">
          <CarouselDemo />
        </ComponentSection>

        <ComponentSection id="chart" title="Chart" description="Beautiful charts built using Recharts, with theming support.">
          <ChartDemo />
        </ComponentSection>

        <ComponentSection id="collapsible" title="Collapsible" description="An interactive component which expands/collapses a panel.">
          <CollapsibleDemo />
        </ComponentSection>

        <ComponentSection id="kbd" title="Kbd" description="Displays a keyboard shortcut or key combination.">
          <KbdDemo />
        </ComponentSection>

        <ComponentSection id="progress" title="Progress" description="Displays an indicator showing the completion progress of a task.">
          <ProgressDemo />
        </ComponentSection>

        <ComponentSection id="skeleton" title="Skeleton" description="Used to show a placeholder while content is loading.">
          <SkeletonDemo />
        </ComponentSection>

        <ComponentSection id="spinner" title="Spinner" description="A loading spinner indicator.">
          <SpinnerDemo />
        </ComponentSection>

        <ComponentSection id="table" title="Table" description="A responsive table component.">
          <TableDemo />
        </ComponentSection>
      </section>

      {/* Dialogs & Overlays */}
      <section className="mb-16">
        <h2 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-6" id="dialogs-overlays">
          Dialogs & Overlays
        </h2>

        <ComponentSection id="alert-dialog" title="Alert Dialog" description="A modal dialog that interrupts the user with important content and expects a response.">
          <AlertDialogDemo />
        </ComponentSection>

        <ComponentSection id="command" title="Command" description="Fast, composable, unstyled command menu for React.">
          <CommandDemo />
        </ComponentSection>

        <ComponentSection id="dialog" title="Dialog" description="A window overlaid on the primary window, rendering content on top.">
          <DialogDemo />
        </ComponentSection>

        <ComponentSection id="drawer" title="Drawer" description="A panel that slides out from the edge of the screen.">
          <DrawerDemo />
        </ComponentSection>

        <ComponentSection id="hover-card" title="Hover Card" description="Displays additional content when hovering over a trigger.">
          <HoverCardDemo />
        </ComponentSection>

        <ComponentSection id="popover" title="Popover" description="Displays rich content in a portal, triggered by a button.">
          <PopoverDemo />
        </ComponentSection>

        <ComponentSection id="sheet" title="Sheet" description="A panel that slides out from an edge of the screen, extending the Dialog.">
          <SheetDemo />
        </ComponentSection>

        <ComponentSection id="tooltip" title="Tooltip" description="A popup that displays information related to an element on hover.">
          <TooltipDemo />
        </ComponentSection>
      </section>

      {/* Feedback */}
      <section className="mb-16">
        <h2 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-6" id="feedback">
          Feedback
        </h2>

        <ComponentSection id="sonner" title="Sonner" description="An opinionated toast component for React.">
          <SonnerDemo />
        </ComponentSection>

        <ComponentSection id="toast" title="Toast" description="A succinct message that is displayed temporarily.">
          <ToastDemo />
        </ComponentSection>
      </section>
    </div>
  )
}
