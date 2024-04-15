package okestro.assignment.exception;

public class CustomInvalidDataException extends RuntimeException{
    public CustomInvalidDataException(String msg) {
        super(msg);
    }
}
