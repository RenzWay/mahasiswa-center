"use client"

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Check} from "lucide-react";
import {useState} from "react";
import {cn} from "@/lib/utils";

export function HeadingTool({editor, headings}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline">Heading</Button>
                {/*<ChevronsUpDown/>*/}
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0">
                <Command>
                    <CommandInput placeholder="Pilih Heading..."/>
                    <CommandList>
                        <CommandGroup>
                            {headings.map((level) => (
                                <CommandItem
                                    key={level}
                                    value={`H${level}`}
                                    onSelect={() => {
                                        editor.chain().focus().toggleHeading({level}).run()
                                        setValue(`H${level}`)
                                        setOpen(false)
                                    }}
                                >
                                    H{level}
                                    <Check
                                        className={cn("ml-auto", value === `H${level}` ? "opacity-100" : "opacity-0")}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
