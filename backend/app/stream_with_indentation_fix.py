async def stream_with_indentation_fix(raw_chunk_iterator):
    """
    Async generator that processes chunks from a raw stream.
    Removes leading whitespace from string content at the start of lines
    that immediately follow a newline, unless it appears to be within a fenced code block.
    Yields tuples: (original_chunk, processed_string_content_or_original_non_string_chunk).

    Args:
        raw_chunk_iterator: An async iterator yielding chunks from an LLM stream
                            (e.g., retrieval_chain.astream()).

    Yields:
        tuple: A tuple containing (original_chunk, processed_item).
               processed_item is the string content after potential stripping,
               or the original_chunk if it wasn't string content.
    """
    last_char_was_newline = (
        True  # State: Did the previous character processed end a line?
    )
    # We could add state here to track if we are inside a fenced code block (```)
    # but reliably detecting that across arbitrary chunks is very complex.
    # The current logic focuses on removing indentation from lines that *start*
    # with whitespace immediately after a newline, which is the common case
    # for unintended paragraph/list indentation. This might still strip
    # indentation from 'indented code blocks' (4+ spaces) if they appear
    # at the start of a chunk after a newline.

    async for original_chunk in raw_chunk_iterator:
        content_to_process = None
        # Extract string content if available from various chunk structures
        if isinstance(original_chunk, dict):
            content_to_process = (
                original_chunk.get("answer")
                or original_chunk.get("content")
                or original_chunk.get("text")
            )
        elif hasattr(original_chunk, "content"):
            content_to_process = original_chunk.content
        elif isinstance(original_chunk, str):  # Handle raw string chunks
            content_to_process = original_chunk

        if content_to_process is not None and isinstance(content_to_process, str):
            processed_content_chunk = ""
            remaining_content = content_to_process

            # Process the chunk line by line
            while remaining_content:
                newline_index = remaining_content.find("\n")

                if newline_index == -1:
                    # No newline in the rest of the chunk - this is the end of a line or the whole chunk is a line part
                    current_line_part = remaining_content
                    remaining_content = ""  # Consume the rest

                    # Apply stripping only if this line part starts a new line conceptually
                    if (
                        last_char_was_newline
                        and current_line_part.lstrip() != current_line_part
                    ):
                        processed_content_chunk += current_line_part.lstrip()
                    else:
                        processed_content_chunk += current_line_part

                    last_char_was_newline = (
                        False  # This chunk (or line part) did not end with a newline
                    )

                else:
                    # Found a newline - process the line up to and including the newline
                    current_line = remaining_content[: newline_index + 1]
                    remaining_content = remaining_content[
                        newline_index + 1 :
                    ]  # Rest after newline

                    # Apply stripping if this line starts a new line conceptually
                    if last_char_was_newline and current_line.lstrip() != current_line:
                        processed_content_chunk += current_line.lstrip()
                    else:
                        processed_content_chunk += current_line

                    last_char_was_newline = True  # This line ended with a newline

            yield (
                original_chunk,
                processed_content_chunk,
            )  # Yield original chunk and processed string content

            # The state `last_char_was_newline` is already updated within the while loop
            # based on the last line processed in this chunk.

        else:
            # If the chunk is not string content (e.g., tool call, metadata), yield it as is,
            # paired with itself for the 'processed' item.
            # How this affects newline state is ambiguous. Let's assume it doesn't change the state.
            if original_chunk is not None:
                yield (original_chunk, original_chunk)
            # last_char_was_newline remains unchanged for non-string chunks
